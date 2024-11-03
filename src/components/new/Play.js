import { useRecoilState, useRecoilValue } from "recoil";
import useProject, { projectAtom } from "../../utils/useProject";
import { ColorPicker, Checkbox, Slider, Input, ConfigProvider, App } from "antd";
import { useRef, useState } from "react";
import { Appearing, FullScreenContainer, withGlass } from "./FullScreen";
import { sideBarAtom } from "./SideBar";
import tw from "tailwind-styled-components";
import { useUser } from "../../utils/useUser";
import { LogInBGStyle } from "./AdStuff";
import { accessControlAtom } from "../../utils/accessControl";


const Container = withGlass(`mt-16 justify-center flex flex-col p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg w-96 h-full`)
const SingleParam = tw.div`w-full flex gap-4 items-center justify-between rounded-lg hover:bg-white p-1 transition-all duration-200`
const ParamName = tw.div`text-sm flex-1 text-right`
const ParamInput = tw.div`flex-1`

export default function Play() {
    const [sideBarState, setSideBarState] = useRecoilState(sideBarAtom)
    const [changes, setChanges] = useState(0)
    const [canPlay, setCanPlay] = useState(true)

    const isActive = sideBarState == 'PLAY'

    const handleChange = () => {
        setChanges(p => p + 1)
    }

    return (
        <FullScreenContainer $isTop={isActive}>
            <Appearing active={isActive}>
                <Params onChange={handleChange} enabled={canPlay} />
            </Appearing>
            <Appearing active={isActive}>
                <LimitedAccess changes={changes} setCanPlay={setCanPlay} />
            </Appearing>
        </FullScreenContainer>
    )
}


function Params({ onChange, enabled }) {
    const [projectState, setProjectState] = useRecoilState(projectAtom);
    const project = useProject()

    const handleChange = (key, value, type) => {
        if (!enabled) return
        const newParams = structuredClone(projectState.params);
        newParams[key].value = value;
        setProjectState({ ...projectState, params: newParams });

        if (type == 'finish' && projectState.settings.refreshOnParamsChange) {
            project.rerunParameters(newParams)
        }
        if (type == 'finish') onChange()
    };

    return (
        <>
            <Container>
                {Object.entries(projectState.params).map(([key, value]) => (
                    <Param key={key}
                        {...value}
                        param={key}
                        enabled={enabled}
                        update={newVal => handleChange(key, newVal, 'update')}
                        finish={newVal => handleChange(key, newVal, 'finish')}
                    />
                ))}
            </Container>
        </>
    );
}




function Param(props) {
    const newVal = useRef(props.value)

    const update = (val) => {
        newVal.current = val
        props.update(val)
    }

    const finish = () => {
        console.log('finish', newVal.current)
        props.finish(newVal.current)
    }

    let el
    if (props.type == 'color')
        el = <ColorPicker format={'hex'} value={props.value}
            onChange={(val, hex) => update(hex)}
            onChangeComplete={finish} />

    if (props.type == 'boolean')
        el = <Checkbox checked={newVal.current}
            onChange={(e) => {
                update(e.target.checked)
                finish()
            }
            } />

    if (props.type == 'number')
        el = <Slider defaultValue={props.value} min={props.min} max={props.max} step={props.step}
            onChange={val => update(val)}
            onChangeComplete={finish} />

    if (props.type == 'range')
        el = <Slider range={true} defaultValue={props.value} min={props.min} max={props.max} step={props.step}
            onChange={val => update(val)}
            onChangeComplete={finish} />

    if (props.type == 'expression' || props.type == 'string')
        el = <Input defaultValue={props.value}
            onChange={val => update(val.target.value)}
        />
    if (props.type == 'image')
        el = <CustomImageUploader defaultImage={props.value} onImageUpdate={props.finish} />

    if (props.type == 'array') {
        if (props.subtype == 'color') {
            el = props.value.map((v, i) => (
                <ColorPicker key={i} format={'hex'} value={v}
                    onChange={(val, hex) => {
                        const newVals = [...newVal.current]
                        newVals[i] = hex
                        newVal.current = newVals
                        props.update(newVals)
                    }}
                    onChangeComplete={finish}
                />
            ))
        }
    }

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: 'black',
                    borderRadius: 2,
                },
            }}
        >
            <SingleParam className={props.enabled ? '' : 'pointer-events-none opacity-50'}>
                <ParamName>{props.name}</ParamName>
                <ParamInput>{el}</ParamInput>
            </SingleParam>
        </ConfigProvider>
    )
}





const CustomImageUploader = ({ defaultImage, onImageUpdate }) => {
    const [previewUrl, setPreviewUrl] = useState(defaultImage);
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                onImageUpdate(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please select a valid JPG or PNG image.");
        }
    };

    return (
        <div className="relative w-32 h-32 cursor-pointer" onClick={handleImageClick}>
            <img style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid black', marginTop: '3px' }}
                src={previewUrl} alt="Upload preview"
                className="w-full h-full object-cover rounded-full" />
            <input type="file" ref={fileInputRef}
                onChange={handleFileChange} accept="image/jpeg,image/png" style={{ display: 'none' }} />
        </div>
    );
};

const LimitedAccessContainer = tw.div`mt-4 justify-center flex flex-col p-4 bg-white bg-opacity-50 backdrop-blur-sm rounded-lg w-96 h-full shadow-md`
const LoginButton = tw.button`mt-4 border-2 text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-200`

function LimitedAccess({ changes, setCanPlay }) {
    const accessControl = useRecoilValue(accessControlAtom)
    const user = useUser()

    if (!accessControl.limitations.includes('params')) return null

    if (changes == 3) setCanPlay(false)
    let title = 'Limited Access'
    if (changes <= 3) title = `Only ${3 - changes} changes left`
    return (
        <LimitedAccessContainer style={LogInBGStyle}>
            <h1 className="text-xl font-bold text-white" style={{ textShadow: '0 0 5px black' }}>{title}</h1>
            <p className="text-white text-sm"
                style={{ textShadow: '0 0 5px black' }}
            >Sign in for FREE to keep playing</p>
            <LoginButton onClick={user.login}>Sign In</LoginButton>
        </LimitedAccessContainer>
    )
}