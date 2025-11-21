import TagInput from "@/components/ui/input/tagInput";
import renderWithQuery from "@/tests/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TagInput Test", () => {
  test("TagItem 렌더링을 확인한다.", () => {
    renderWithQuery(<TagInput tags={["nextjs", "react"]} callback={jest.fn()} />);

    expect(screen.getByText("nextjs")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  test("Enter 입력시 Tag 배열값 추가를 확인한다.", async () => {
    const user = userEvent.setup();
    const mockCb = jest.fn();

    renderWithQuery(<TagInput tags={["apple"]} callback={mockCb} />);

    const input = screen.getByPlaceholderText("태그를 입력하세요.");

    await user.type(input, "banana");
    await user.keyboard("{Enter}");

    expect(mockCb).toHaveBeenCalledWith(["apple", "banana"]);
  });

  test("Backspace 입력시 Tag 배열값 삭제를 확인한다.", async () => {
    const user = userEvent.setup();
    const mockCb = jest.fn();

    renderWithQuery(<TagInput tags={["apple", "banana"]} callback={mockCb} />);

    const input = screen.getByPlaceholderText("태그를 입력하세요.");
    await user.click(input);
    await user.keyboard("{Backspace}");

    expect(mockCb).toHaveBeenCalledWith(["apple"]);
  });

  test("자동완성 팝업 렌더링을 확인한다", async () => {
    const user = userEvent.setup();

    renderWithQuery(<TagInput tags={[]} />);

    const input = screen.getByPlaceholderText("태그를 입력하세요.");

    await user.type(input, "banana");
    const popup = await screen.findByTestId("suggestion-popup");
    expect(popup).toBeInTheDocument();
  });
});
