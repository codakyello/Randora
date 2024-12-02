import React, { forwardRef, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker, {
  ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  StyleObjectOrFn,
  Text,
  useTheme,
  css as chakraCSS,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ClassNames } from "@emotion/react";

const CustomInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input>
>((props, ref) => {
  return (
    <InputGroup>
      <Input fontSize={"1.6rem"} height={"5rem"} {...props} ref={ref} />
      <InputRightElement
        alignItems={"center"}
        userSelect="none"
        pointerEvents="none"
      >
        <CalendarIcon className="absolute top-7 right-10 text-[1.6rem]" />
      </InputRightElement>
    </InputGroup>
  );
});

CustomInput.displayName = "CustomInput";

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => {
  return (
    <Stack pb={1} isInline alignItems="center" textAlign="left" pl={4} pr={2}>
      <Text color="gray.700" flex={1} fontSize="1.6rem" fontWeight="medium">
        {new Intl.DateTimeFormat("en-AU", {
          year: "numeric",
          month: "long",
        }).format(date)}
      </Text>
      <IconButton
        borderRadius="full"
        size="sm"
        variant="ghost"
        aria-label="Previous Month"
        icon={<ChevronLeftIcon fontSize="14px" />}
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      />
      <IconButton
        borderRadius="full"
        size="sm"
        variant="ghost"
        aria-label="Next Month"
        icon={<ChevronRightIcon fontSize="14px" />}
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      />
    </Stack>
  );
};

function useDatePickerStyles() {
  const theme = useTheme();
  return useMemo(() => {
    const defaultStyles: StyleObjectOrFn = {
      p: 3, // Increase padding for the container
      bg: "white",
      border: "1px solid",
      borderColor: "gray.100",
      boxShadow: "sm",
      "& .react-datepicker": {
        "&__header": {
          fontSize: "1.6rem",
          bg: "none",
          borderBottom: "none",
          pb: 0, // Add padding below the header for spacing
        },

        "&__day-name": {
          color: "gray.400",
          fontWeight: "medium",
          w: 12,
          h: 12,
          fontSize: "1.4rem",
        },
        "&__day": {
          lineHeight: "unset",
          color: "gray.700",
          w: 12,
          h: 12,
          borderRadius: "full", // Circular shape
          alignContent: "center",
          fontSize: "1.4rem", // Adjust font size
          margin: "2px", // Add spacing between days
        },
        "&__day:not(.react-datepicker__day--selected, .react-datepicker__day--keyboard-selected):hover":
          {
            bg: "white",
            boxShadow: "0 0 1px 1px rgba(0,0,0,0.2)",
          },
        "&__day--today": {
          bg: "gray.100",
          fontWeight: "400",
          textAlign: "center",
        },
        "&__day--selected, &__day--keyboard-selected": {
          borderRadius: "50%",
          bg: "#3635e0",
          color: "white",
        },
      },
    };
    return chakraCSS(defaultStyles)(theme);
  }, [theme]);
}

export interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
}

export const DatePicker = ({
  onChange,
  value,
}: {
  onChange: (date: Date | null) => void;
  value: Date | null;
}) => {
  const styles = useDatePickerStyles();
  return (
    <ClassNames>
      {({ css }) => (
        <ReactDatePicker
          className="absolute"
          dateFormat="dd MMMM, yyyy"
          showPopperArrow={false}
          popperClassName={css({ marginTop: "4px!important" })}
          calendarClassName={css(styles)}
          selected={value}
          onChange={(value) => onChange(value)}
          minDate={new Date()}
          customInput={<CustomInput />}
          renderCustomHeader={CustomHeader}
          shouldCloseOnSelect={false}
        />
      )}
    </ClassNames>
  );
};
