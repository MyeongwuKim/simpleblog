// app/tests/ui/DefButton.test.tsx
import DefButton from "@/components/ui/buttons/defButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("DefButton Test", () => {
  test("라벨확인", () => {
    render(<DefButton innerItem="저장" />);
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });
  test("클릭 시 onClick 호출된다", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<DefButton onClickEvt={onClick} innerItem="저장" />);
    await user.click(screen.getByRole("button", { name: "저장" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
