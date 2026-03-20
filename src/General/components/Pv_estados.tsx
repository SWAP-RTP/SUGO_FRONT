import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const Pv_estados = () => {
  const products = [
    {
      code: "1000",
      name: "Bamboo Watch",
      category: "Accessories",
      quantity: 24,
    },
    {
      code: "1001",
      name: "Black Watch",
      category: "Accessories",
      quantity: 61,
    },
    { code: "1002", name: "Blue Band", category: "Fitness", quantity: 2 },
    { code: "1003", name: "Blue T-Shirt", category: "Clothing", quantity: 25 },
  ];

  const header = (
    <div className="table-header">
      <h5 className="table-title">Estados en Parque Vehicular</h5>
    </div>
  );

  return (
    <>
      <div className="d-flex justify-content-center">
        <p className="title_pv">REGISTRO DE DESPACHO EN PARQUE VEHICULAR</p>
      </div>

      <div className="pv_estados_tabla d-flex justify-content-center">
        <DataTable
          value={products}
          paginator
          rows={10}
          dataKey="id"
          filterDisplay="row"
          globalFilterFields={[
            "name",
            "country.name",
            "representative.name",
            "status",
          ]}
          header={header}
          emptyMessage="No customers found."
        >
          <Column
            field="name"
            header="Name"
            filter
            filterPlaceholder="Search by name"
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="Country"
            filterField="country.name"
            style={{ minWidth: "12rem" }}
            filter
            filterPlaceholder="Search by country"
          />
          <Column
            header="Agent"
            filterField="representative"
            showFilterMenu={false}
            filterMenuStyle={{ width: "14rem" }}
            style={{ minWidth: "14rem" }}
            filter
          />
        </DataTable>
      </div>
    </>
  );
};
