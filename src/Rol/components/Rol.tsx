import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

export const Roles = () => {
  return (
    <>
      <TabView>
        <TabPanel header="Carga de Roles">
          <div className="d-flex justify-content-end">
            <FileUpload
              mode="basic"
              name="demo[]"
              url="/api/upload"
              accept=".csv,.xlsx,.xls"
              maxFileSize={1000000}
              chooseLabel="Subir Archivo"
            />
            <div className="g-5">
              <Button label=" subir" severity="success" />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Editar">
          <p>Content for editar</p>
        </TabPanel>
      </TabView>
    </>
  );
};
