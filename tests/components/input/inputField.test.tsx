import InputField from "@/components/ui/input/inputField";
import { render, screen } from "@testing-library/react";
import { HiSearch } from "react-icons/hi";

describe("InputField Test", () => {
  test("기본 렌더링이 잘 되는지 확인한다.", () => {
    render(<InputField type="text" size="md" placeholder="검색" />);

    const input = screen.getByPlaceholderText("검색");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  test("아이콘 props가 전달되면 아이콘이 렌더링된다.", () => {
    //flowbite icon을 확인할 방법이없음, 아니면 컴포넌트 수정해야함.
    const { container } = render(<InputField type="text" size="md" icon={HiSearch} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
