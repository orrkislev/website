import { useRecoilState, useRecoilValue } from "recoil";
import useProject, { projectAtom } from "../utils/useProject";
import { topBarAtom } from "./Tabs";

import { ColorPicker, Checkbox, Slider, Input, Form } from "antd";
import { useRef } from "react";

export default function Params() {
    const [projectState, setProjectState] = useRecoilState(projectAtom);
    const projectData = useProject()
    const topBarState = useRecoilValue(topBarAtom)

    if (topBarState.main !== 'parameters') return null;
    if (!projectState.params) return null;

    const onChange = (key, value) => {
        console.log(key, value)
        const newParams = structuredClone(projectState.params)
        newParams[key].value = value
        setProjectState({ ...projectState, params: newParams })
    }

    return (
        <Form
            labelCol={{ span: 7 }}
            layout="horizontal"
            style={{ maxWidth: 500, margin: 5 }}
        >
            {Object.entries(projectState.params).map(([key, value]) => (
                <Param key={key} {...value} param={key} update={newVal => onChange(key, newVal)} />
            ))}
        </Form>
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
        <Form.Item label={props.name} style={{ background: 'white', marginBottom: '5px', padding: '0px 2em', border:'2px solid black', borderRadius:'999px' }}>
            {el}
        </Form.Item>
    )

}