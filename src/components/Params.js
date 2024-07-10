import { useRecoilState, useRecoilValue } from "recoil";
import { projectAtom } from "../utils/useProject";
import { topBarAtom } from "./Tabs";

import { ColorPicker, Checkbox, Slider, Input, Form } from "antd";

export default function Params() {
    const [projectState, setProjectState] = useRecoilState(projectAtom);
    const topBarState = useRecoilValue(topBarAtom)

    if (topBarState.main !== 'parameters') return null;
    if (!projectState.params) return null;

    const onChange = (key, value) => {
        const newParams = structuredClone(projectState.params)
        newParams[key].value = value
        setProjectState({ ...projectState, params: newParams })
    }

    return (
        <Form
            labelCol={{ span: 8 }}
            layout="horizontal"
            style={{ maxWidth: 500, padding: '2em'}}
        >
            {Object.entries(projectState.params).map(([key, value]) => (
                <Param key={key} {...value} param={key} onChange={newVal => onChange(key, newVal)} />
            ))}
        </Form>
    );
}

function Param(props) {

    const onChange = (value) => {
        if (props.type == 'color') props.onChange(value)
        if (props.type == 'range') props.onChange(value)
        if (props.type == 'number') props.onChange(value)
        if (props.type == 'boolean') props.onChange(value)
        if (props.type == 'boolean') props.onChange(value.target.checked)
        if (props.type == 'expression' || props.type == 'string') props.onChange(value.target.defaultValue)
    }

    const onChangeArray = (i, value) => {
        const newArr = [...props.value]
        newArr[i] = value
        props.onChange(newArr)
    }

    let el
    if (props.type == 'color')
        el = <ColorPicker format={'hex'} value={props.value} onChange={(val, hex) => onChange(hex)} />

    if (props.type == 'boolean')
        el = <Checkbox checked={props.value} onChange={onChange} />

    if (props.type == 'number')
        el = <Slider defaultValue={props.value} onChange={onChange} {...props} />

    if (props.type == 'range')
        el = <Slider range={true} defaultValue={props.value} onChange={onChange} {...props} />

    if (props.type == 'expression' || props.type == 'string')
        el = <Input defaultValue={props.value} onChange={onChange} />

    if (props.type == 'array') {
        if (props.subtype == 'color') {
            el = props.value.map((v, i) => (
                <ColorPicker key={i} format={'hex'} value={v} onChange={(val, hex) => onChangeArray(i,hex)} />
            ))
        }
    }

    return (
        <Form.Item label={props.name} style={{background:'white', marginBottom:'5px', padding:'0px 2em'}}>
            {el}
        </Form.Item>
    )

}