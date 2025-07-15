import { 
  Drawer,
  Heading,
  Label,
  Input,
  Button,
} from "@medusajs/ui"
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

    console.log("EditForm data:", data.description) // This will log the product object, including its ID
  const form = useForm<zod.infer<typeof schema>>({
    defaultValues: {
      descripcionLarga: data.description || "",
    },
  })

  const handleSubmit = form.handleSubmit(({ descripcionLarga }) => {
    // TODO submit to backend
    console.log(descripcionLarga)
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
              Edit Item
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