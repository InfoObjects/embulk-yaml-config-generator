import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import Button from "react-bootstrap/Button";

type Props = {
  yamlText: string;
  saveYaml: Function;
};

const CodeMirrors: React.FC<Props> = ({ yamlText, saveYaml }) => {
  const [yamlValue, setyamlValue] = useState<string>("");
  useEffect(() => {
    setyamlValue(yamlText);
  }, [yamlText]);

  const handleSave = () => {
    saveYaml(yamlValue);
  };
  return (
    <>
      <CodeMirror
        value={yamlValue}
        height="350px"
        onChange={setyamlValue}
        extensions={[StreamLanguage.define(yaml)]}
      />

      <div className="text-end">
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default CodeMirrors;
