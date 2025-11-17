import { render, screen, fireEvent } from "@testing-library/react";
import DropdownBox from "@/components/ui/dropdown/dropdownBox";
import userEvent from "@testing-library/user-event";

const items = [
  { value: "apple", content: "사과" },
  { value: "banana", content: "바나나" },
  { value: "orange", content: "오렌지" },
];
//비동기처리는 userEvent로 한다
describe("DropdownBox Test", () => {
  test("초기값을 세팅한다.", () => {
    render(<DropdownBox items={items} value="banana" />);

    // label은 button 으로 처리됨
    const labelButton = screen.getByRole("button", { name: "바나나" });
    expect(labelButton).toBeInTheDocument();
  });

  test("드롭다운을 클릭하면 옵션 목록이 렌더링된다", async () => {
    render(<DropdownBox items={items} value="apple" />);

    const labelButton = screen.getByRole("button", { name: "사과" });
    await userEvent.click(labelButton); // dropdown 열기

    expect(screen.getByText("바나나")).toBeInTheDocument();
    expect(screen.getByText("오렌지")).toBeInTheDocument();
  });

  test("DropdownItem 클릭 시 callback으로 값을 받아온다.", async () => {
    const mockClick = jest.fn();

    render(<DropdownBox items={items} value="apple" clickEvt={mockClick} />);

    const labelButton = screen.getByRole("button", { name: "사과" });
    await userEvent.click(labelButton);

    const bananaItem = screen.getByText("바나나");
    await userEvent.click(bananaItem);

    expect(mockClick).toHaveBeenCalledWith("banana");
  });
});
