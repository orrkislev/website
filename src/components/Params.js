import { useRecoilState, useRecoilValue } from "recoil";
import useProject, { projectAtom } from "../utils/useProject";
import { topBarAtom } from "./Tabs";
import styled from "styled-components";
import { motion } from 'framer-motion';

import { ColorPicker, Checkbox, Slider, Input, ConfigProvider } from "antd";
import { useRef, useState } from "react";


const ParamContainer = styled(motion.div)`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: white;
    border: 2px solid black;
    border-radius: 10px;
    margin: 5px;
    width: 20em;
`;

const SingleParam = styled.div`
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
    const topBarState = useRecoilValue(topBarAtom);
    const [arrowHover, setArrowHover] = useState(false);
    const [hidden, setHidden] = useState(false);

    if (topBarState.main !== 'parameters') return null;
    if (!projectState.params) return null;

    const onChange = (key, value) => {
        const newParams = structuredClone(projectState.params);
        newParams[key].value = value;
        setProjectState({ ...projectState, params: newParams });
    };

    return (
        <ParamContainer animate={{ x: hidden ? '-20em' : 0 }} initial={{ x: '-25em' }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            {Object.entries(projectState.params).map(([key, value]) => (
                <Param key={key} {...value} param={key} update={newVal => onChange(key, newVal)} />
            ))}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '45%',
                    left: '95%',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px'
                }}
                onMouseEnter={() => setArrowHover(true)}
                onMouseLeave={() => setArrowHover(false)}
                onClick={() => setHidden(!hidden)}
                animate={{ rotate: hidden ? 180 : 0 }}
            >
                <svg width="40" height="40" viewBox="-10 -10 30 30" xmlns="http://www.w3.org/2000/svg">
                    <motion.circle
                        cx="3"
                        cy="5"
                        r="8"
                        fill="white"
                        stroke="black"
                        strokeWidth="1.5"
                        animate={{ r: arrowHover ? 12 : 8 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                    />
                    <polyline
                        points="5,0 0,5 5,10"
                        stroke="black"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </motion.div>
        </ParamContainer>
    );
}

function Param(props) {
    const newVal = useRef(props.value)

    let el
    if (props.type == 'color')
        el = <ColorPicker format={'hex'} value={props.value}
            onChange={(val, hex) => newVal.current = hex}
            onChangeComplete={() => props.update(newVal.current)}
        />

    if (props.type == 'boolean')
        el = <Checkbox checked={props.value} onChange={(e) => props.update(e.target.checked)} />

    if (props.type == 'number')
        el = <Slider defaultValue={props.value} min={props.min} max={props.max} step={props.step}
            onChange={val => newVal.current = val}
            onChangeComplete={() => props.update(newVal.current)}
        />

    if (props.type == 'range')
        el = <Slider range={true} defaultValue={props.value} min={props.min} max={props.max} step={props.step}
            onChange={val => newVal.current = val}
            onChangeComplete={() => props.update(newVal.current)}
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
