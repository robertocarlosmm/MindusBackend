import { 
  Drawer,
  Heading,
  Label,
  Input,
  Button,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { 
  useForm, 
  FormProvider,
  Controller,
} from "react-hook-form"
import * as zod from "zod"

const schema = zod.object({
  descripcionLarga: zod.string(),
})





export const EditForm = ({data}) => {

  
 const [extendedData, setExtendedData] = useState(null)

  // console.log("EditForm data:", data.description) // This will log the product object, including its ID




   useEffect(() => {
    fetch("https://seller.mindus.lat/getFullProducto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idProducto: data.id }),
      credentials: "include", // if authentication is required
    })
      .then(res => res.json())
      .then(result => {
        // Handle the result as needed
        // console.log(result)
        data = result;
         setExtendedData(result);
        // console.log("EditForm data:", data.descripcionTecnica);
          form.reset({
          descripcionLarga: data.descripcionTecnica || "",
        })
      })
      .catch(err => {
        // Handle errors as needed
        console.error(err)
      })
  }, [data.id])

  
  const form = useForm<zod.infer<typeof schema>>({
    defaultValues: {
      descripcionLarga: data.descripcionTecnica || "",
    },
  })
  
  const handleSubmit = form.handleSubmit(async  ({ descripcionLarga }) => {

    // console.log("ID del producto extendido:", extendedData.idProductoExtension);
    // if(extendedData.idProductoExtension == null){
    //   console.log("Creating new product extension with description:", descripcionLarga);
    //   console.log("Product ID:", extendedData.id);
    // }
    // else{
    //   console.log("Updating product extension with ID:", extendedData.idProductoExtension, "and description:", descripcionLarga);
    // }
    

    const body = extendedData?.idProductoExtension
    ? {
        idProducto: extendedData.id,
        idProductoExtension: extendedData.idProductoExtension,
        descripcionTecnica: descripcionLarga,
      }
    : {
        idProducto: extendedData.id,
        descripcionTecnica: descripcionLarga,
      };

      // console.log("Request body:", body);

       try {
        const response = await fetch("https://mindusbackend-production.up.railway.app/AgregarDescripcion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          credentials: "include", // if your API requires authentication
        });

        const result = await response.json();
        // console.log("API response:", result);
        alert("Descripción guardada correctamente");
        // Handle success (e.g., show notification, close drawer, etc.)
      } catch (error) {
        console.error("Error sending request:", error);
        // Handle error (e.g., show error notification)
      }
  })

  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Editar</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
          <Drawer.Header>
            <Heading className="capitalize">
              Editar Descripcion Larga
            </Heading>
          </Drawer.Header>
          <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
            <Controller
              control={form.control}
              name="descripcionLarga"
              render={({ field }) => {
                return (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-x-1">
                      <Label size="small" weight="plus">
                        descripcionLarga
                      </Label>
                    </div>
                    {/* <Input {...field} /> */}
                            <textarea
                            {...field}
                            rows={6}
                            placeholder="Escribe una descripción detallada..."
                            className="min-h-[150px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            />
                  </div>
                )
              }}
            />
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button size="small" type="submit">
                Save
              </Button>
            </div>
          </Drawer.Footer>
          </form>
        </FormProvider>
      </Drawer.Content>
    </Drawer>
  )
}