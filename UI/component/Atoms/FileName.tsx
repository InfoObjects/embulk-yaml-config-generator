import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

type Props = {
  setFileName: Function;
};
const FileName: React.FC<Props> = ({ setFileName }) => {
  const [name, setName] = useState<string>("file");
  const [validated, setValidated] = useState<boolean>(false);

  const onSubmitHandler = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setFileName(name);
    }

    setValidated(true);
    event.preventDefault();
  };
  return (
    <div>
      <Form noValidate validated={validated} onSubmit={onSubmitHandler}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>File Name</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter File Name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Form.Control.Feedback className="fs-8 m-0" type="invalid" tooltip>
              This field is required.
            </Form.Control.Feedback>
            <InputGroup.Text>.yml</InputGroup.Text>
          </InputGroup>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default FileName;
