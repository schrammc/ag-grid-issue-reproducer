import {
  CellSelectionChangedEvent,
  ColDef,
  ModuleRegistry,
} from "ag-grid-community";
import { AllEnterpriseModule, LicenseManager } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component

// Register all Community features
ModuleRegistry.registerModules([AllEnterpriseModule]);
LicenseManager.setLicenseKey("<REPLACE_WITH_YOUR_LICENSE_KEY>");

export const GridComponent = ({
  onCellSelectionChanged,
}: {
  onCellSelectionChanged?: (event: CellSelectionChangedEvent) => void;
}) => {
  // Row Data: The data to be displayed.
  const rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  const colDefs: ColDef[] = [
    { field: "make", editable: true },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ];

  return (
    <div
      // define a height because the Data Grid will fill the size of the parent container
      style={{ height: "500px" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        cellSelection={true}
        onCellSelectionChanged={onCellSelectionChanged}
      />
    </div>
  );
};
