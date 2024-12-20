import { useRecoilState } from "recoil";
import useProject, { projectAtom } from "../utils/useProject";
import styled from "styled-components";
import Section from "./__Section";

import { ColorPicker, Checkbox, Slider, Input, ConfigProvider } from "antd";
import { useRef, useState } from "react";
import { topBarAtom } from "./__TopBar";


const ParamContainer = styled.div`
    justify-content: center;
    display: flex;
    gap: 1em;
    flex-wrap: wrap;
    padding: .5em 1em;
    background: white;
    border-radius: 10px;
    margin: 5px;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
    min-height: 6vh;
`;

const SingleParam = styled.div`
    width: 12em;
    display: flex;
    gap: 4px;
    align-items: center;
`;

const ParamName = styled.div`
    font-size: 11px;
    flex:1;
    text-align: right;
`;
const ParamInput = styled.div`
    flex:2;
`;



export default function Params() {
    const [projectState, setProjectState] = useRecoilState(projectAtom);
    const project = useProject()
    const [topBarState, setTopBarState] = useRecoilState(topBarAtom)
    const changes = useRef(0)

    const onChange = (key, value, type) => {
        const newParams = structuredClone(projectState.params);
        newParams[key].value = value;
        setProjectState({ ...projectState, params: newParams });

        if (changes.current++ == 10) {
            setTopBarState({ ...topBarState, publish: true });
        }

        if (type == 'finish' && projectState.settings.refreshOnParamsChange) {
            project.rerunParameters(newParams)
        }
    };

    return (
        <Section name='params' title="PLAY with parameters">
            <ParamContainer>
                {Object.entries(projectState.params).map(([key, value]) => (
                    <Param key={key}
                        {...value}
                        param={key}
                        update={newVal => onChange(key, newVal, 'update')}
                        finish={newVal => onChange(key, newVal, 'finish')}
                    />
                ))}
            </ParamContainer>
        </Section>
    );
}






function Param(props) {
    const newVal = useRef(props.value)

    const update = (val) =>{
        newVal.current = val
        props.update(val)
    }

    const finish = () =>{
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
                finish()}
             }/>

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
            <SingleParam>
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
