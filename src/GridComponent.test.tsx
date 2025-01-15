import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GridComponent } from "./GridComponent";

const carMakers = ["Tesla", "Ford", "Toyota"];

describe("GridComponent", () => {
  it("renders with fixture data as expected", async () => {
    render(<GridComponent />);

    await Promise.all(
      carMakers.map(
        async (carMaker) =>
          await waitFor(() =>
            expect(() => screen.getByText(carMaker)).not.toThrow()
          )
      )
    );
  });

  // Click on Toyota
  // Expectation:
  //   - Toyota cell is selected
  //   - a cellSelectionChanged event is fired
  describe("Cell selection", () => {
    it("can do single cell selection by click", async () => {
      const user = userEvent.setup();

      const onCellSelectionChanged = vi.fn();
      render(<GridComponent onCellSelectionChanged={onCellSelectionChanged} />);

      const toyotaCell = await waitFor(() => screen.getByText("Toyota"));

      await user.click(toyotaCell);
      // Alternative approach based on ag-grid docs here
      // fireEvent.mouseDown(toyotaCell);

      await waitFor(() => expect(onCellSelectionChanged).toHaveBeenCalled());

      await waitFor(() =>
        expect(toyotaCell.classList).toContain("ag-cell-range-selected")
      );
    });

    // Click on Tesla, hold down shift, and click on Toyota, release shift
    // Expectation:
    //   - Tesla and Toyota cells are selected
    //   - A cellSelectionChanged event is fired
    it("can do cell range selection by shift-click", async () => {
      const user = userEvent.setup();

      const onCellSelectionChanged = vi.fn();
      render(<GridComponent onCellSelectionChanged={onCellSelectionChanged} />);

      const teslaCell = await waitFor(() => screen.getByText("Tesla"));
      const toyotaCell = screen.getByText("Toyota");

      await user.click(teslaCell);
      await user.keyboard("{ShiftLeft>}");
      await user.click(toyotaCell);
      await user.keyboard("{/ShiftLeft}");

      await waitFor(() => expect(onCellSelectionChanged).toHaveBeenCalled());

      await waitFor(() =>
        expect(teslaCell.classList).toContain("ag-cell-range-selected")
      );
    });

    // Click on 'Tesla' cell, hold down the left mouse button, drag to 'Toyota' cell, release the left mouse button
    // Expectation:
    //   - Tesla and Toyota cells are selected
    //   - A cellSelectionChanged event is fired
    it("can do cell range selection by drag", async () => {
      const user = userEvent.setup();

      const onCellSelectionChanged = vi.fn();
      render(<GridComponent onCellSelectionChanged={onCellSelectionChanged} />);

      const teslaCell = await waitFor(() => screen.getByText("Tesla"));
      const toyotaCell = screen.getByText("Toyota");

      user.pointer([
        { keys: "[MouseLeft>]", target: teslaCell },
        { target: toyotaCell },
        { keys: "[/MouseLeft]" },
      ]);

      await waitFor(() => expect(onCellSelectionChanged).toHaveBeenCalled());

      await waitFor(() =>
        expect(teslaCell.classList).toContain("ag-cell-range-selected")
      );
    });
  });
});
