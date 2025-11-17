import { render, screen, fireEvent } from "@testing-library/react";
import DefButton from "@/components/ui/buttons/defButton";

describe("DefButton Test", () => {
  test("text와 아이콘이 렌더링되어야 한다", () => {
    const Icon = () => <svg data-testid="test-icon" />;
    render(<DefButton innerItem="확인" iconEle={<Icon />} />);

    expect(screen.getByText("확인")).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  test("클릭 시 onClickEvt가 호출되어야 한다", () => {
    const fn = jest.fn();
    render(<DefButton innerItem="버튼" onClickEvt={fn} />);
    fireEvent.click(screen.getByText("버튼"));
    expect(fn).toHaveBeenCalled();
  });

  test("FlowBite outline이 적용된다", () => {
    render(<DefButton innerItem="btn" outline />);
    const button = screen.getByRole("button");

    expect(button.className).toMatch(/outline|border/);
  });

  test("FlowBite color가 적용된다", () => {
    render(<DefButton innerItem="btn" btnColor="cyan" />);
    const button = screen.getByRole("button");

    expect(button.className).toMatch(/cyan|bg-cyan|text-cyan/);
  });

  test("Tailwind className이 합쳐져야 한다", () => {
    render(<DefButton innerItem="btn" className="bg-red-500" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-red-500");
  });

  test("theme 오버라이드 snapshot", () => {
    const { container } = render(<DefButton innerItem="btn" />);
    expect(container).toMatchSnapshot();
  });
});
