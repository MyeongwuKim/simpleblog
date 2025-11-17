import { render, screen, fireEvent } from "@testing-library/react";
import ToggleButton from "@/components/ui/buttons/toggleButton";

describe("ToggleButton Test", () => {
  test("체크되지 않은 상태라면 unCheckIcon이 렌더링된다", () => {
    render(
      <ToggleButton
        checkIcon={<svg data-testid="check" />}
        unCheckIcon={<svg data-testid="uncheck" />}
        isCheck={false}
        clickCallback={() => {}}
      />
    );

    expect(screen.getByTestId("uncheck")).toBeInTheDocument();
    expect(screen.queryByTestId("check")).toBeNull();
  });
  test("체크된 상태라면 CheckIcon이 렌더링된다", () => {
    render(
      <ToggleButton
        checkIcon={<svg data-testid="check" />}
        unCheckIcon={<svg data-testid="uncheck" />}
        isCheck={true}
        clickCallback={() => {}}
      />
    );

    expect(screen.getByTestId("check")).toBeInTheDocument();
    expect(screen.queryByTestId("uncheck")).toBeNull();
  });

  test("클릭 이벤트를 체크한다 true -> false", () => {
    const fn = jest.fn();
    render(
      <ToggleButton
        checkIcon={<svg data-testid="check" />}
        unCheckIcon={<svg data-testid="uncheck" />}
        isCheck={true}
        clickCallback={fn}
      />
    );

    const btn = screen.getByRole("button");

    // 처음에는 check만 보여야 함
    expect(screen.getByTestId("check")).toBeInTheDocument();
    expect(screen.queryByTestId("uncheck")).toBeNull();

    // 클릭
    fireEvent.click(btn);

    // 이제 uncheck가 보여야 함
    expect(screen.getByTestId("uncheck")).toBeInTheDocument();
    expect(screen.queryByTestId("check")).toBeNull();
    //콜백값 기대
    expect(fn).toHaveBeenCalledWith(false);
  });
});
