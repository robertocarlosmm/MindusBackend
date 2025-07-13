import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container } from "../components/container"
import { Header } from "../components/header"
import { EditForm } from "../components/edit-form"

const ProductWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  console.log("Product data:", data) // This will log the product object, including its ID
  return (
    <Container>
      <Header
        title="Descripción del Larga del Producto"
        actions={[
          {
            type: "custom",
            children: <EditForm data={data} />,
          },
        ]}
      />
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductWidget