import { useRecoilState } from "recoil";
import { projectAtom } from "../utils/useProject";
import styled from "styled-components";
import Section from "./__Section";

import { ColorPicker, Checkbox, Slider, Input, ConfigProvider } from "antd";
import { useEffect, useRef, useState } from "react";

    
const ParamContainer = styled.div`
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    background: white;
    border-radius: 10px;
    margin: 5px;
    width: 100%;
    backdrop-filter: blur(5px);
    background: rgba(255, 255, 255, 0.5);
`;

const SingleParam = styled.div`
    max-width: 8em;
    display: flex;
    gap: 4px;
    align-items: center;
    width: 100%;
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

    const onChange = (key, value) => {
        const newParams = structuredClone(projectState.params);
        newParams[key].value = value;
        setProjectState({ ...projectState, params: newParams });
    };

    return (
        <Section name='params'>
            <h3 style={{margin:'0 2em'}}>PLAY with parameters</h3>
            <ParamContainer>
                {Object.entries(projectState.params).map(([key, value]) => (
                    <Param key={key} {...value} param={key} update={newVal => onChange(key, newVal)} />
                ))}
            </ParamContainer>
        </Section>
    );
}






function Param(props) {
    const newVal = useRef(props.value)

    let el
    if (props.type == 'color')
        el = <ColorPicker format={'hex'} value={props.value}
            onChange={(val, hex) => props.update(hex)}
        />

    if (props.type == 'boolean')
        el = <Checkbox checked={props.value} onChange={(e) => props.update(e.target.checked)} />

    if (props.type == 'number')
        el = <Slider defaultValue={props.value} min={props.min} max={props.max} step={props.step}
            onChange={val => props.update(val)}
        />

    if (props.type == 'range')
        el = <Slider range={true} defaultValue={props.value} min={props.min} max={props.max} step={props.step}
            onChange={val => props.update(val)}
        />

    if (props.type == 'expression' || props.type == 'string')
        el = <Input defaultValue={props.value}
            onChange={val => newVal.current = val}
            onChangeComplete={() => props.update(newVal.current)}
        />
    if (props.type == 'image')
        el = <CustomImageUploader defaultImage={props.value} onImageUpdate={props.update} />

    if (props.type == 'array') {
        if (props.subtype == 'color') {
            el = props.value.map((v, i) => (
                <ColorPicker key={i} format={'hex'} value={v}
                    onChange={(val, hex) => {
                        const newVals = [...newVal.current]
                        newVals[i] = hex
                        newVal.current = newVals
                    }}
                    onChangeComplete={() => props.update(newVal.current)}
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
