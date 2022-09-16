import Accordion from "react-bootstrap/Accordion";

type AccordionProps = {
  title: string;
  children: any;
  eventKey?: string;
  callBack: (item: any) => void;
  param: any;
};
const Accordions: React.FC<AccordionProps> = ({ title, children, callBack, param }) => {
  return (
    <Accordion.Item eventKey={title}>
      <Accordion.Header onClick={()=> callBack(param)}>{title}</Accordion.Header>
      <Accordion.Body>{children}</Accordion.Body>
    </Accordion.Item>
  );
};

export default Accordions;
