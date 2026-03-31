import { Card, Rate, Space, Tag, Typography } from "antd";
import type {
  DummyJsonListResponse,
  DummyJsonProduct,
} from "../querytable/adapters/useProductsRtkQuery";

const { Text } = Typography;

export type ProductCardModel = DummyJsonProduct & {
  rating?: number;
  stock?: number;
};

export function ProductCard({ product }: { product: ProductCardModel }) {
  return (
    <Card
      hoverable
      style={{ width: "320px" }}
      bodyStyle={{ padding: 14 }}
      cover={
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{ height: 220, objectFit: "contain" }}
        />
      }
    >
      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        <Text strong>{product.title}</Text>
        <Space size={6} wrap>
          <Tag>{product.category}</Tag>
          <Tag color="green">${product.price}</Tag>
          {typeof product.stock === "number" ? (
            <Tag color={product.stock > 0 ? "blue" : "red"}>
              {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
            </Tag>
          ) : null}
        </Space>
        {typeof product.rating === "number" ? (
          <Rate
            allowHalf
            disabled
            value={product.rating / 2}
            style={{ fontSize: 14 }}
          />
        ) : null}
      </Space>
    </Card>
  );
}

export const rtkResultSelectors = {
  selectItems: (data: DummyJsonListResponse | undefined) =>
    data?.products ?? [],
  selectHasNext: (data: DummyJsonListResponse | undefined) => {
    if (!data) return false;
    return data.skip + data.products.length < data.total;
  },
};
