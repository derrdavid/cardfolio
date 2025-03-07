import { Typography } from "antd";
const { Text } = Typography;

const Breadcrumbs = () => (
    <div className="breadcrumbs">
        <Text type="secondary">
            <a href="#">Home</a> / <a href="#">Portfolio</a> / <span>Pokemon</span>
        </Text>
    </div>
);

export default Breadcrumbs; 