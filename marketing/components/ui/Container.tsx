import { forwardRef } from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = "", size = "lg", children, ...props }, ref) => {
    const maxWidths = {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
    };

    return (
      <div
        ref={ref}
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${maxWidths[size]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };
