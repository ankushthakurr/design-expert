import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-background shadow-glow hover:bg-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_10px_50px_-8px_rgba(0,245,255,0.7)]",
        gradient:
          "text-background bg-[linear-gradient(110deg,#00f5ff,#7b61ff_55%,#00ff9d)] bg-[length:200%_auto] hover:bg-[position:100%_center] shadow-glow-violet",
        secondary: "glass text-foreground hover:bg-white/10 hover:border-white/25",
        outline: "border border-primary/40 text-primary hover:bg-primary/10 hover:border-primary",
        ghost: "text-muted hover:text-foreground hover:bg-white/5",
        accent: "bg-accent text-background hover:bg-white shadow-[0_10px_40px_-10px_rgba(0,255,157,0.6)]",
        link: "text-primary underline-offset-4 hover:underline rounded-none px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-7 text-base",
        xl: "h-14 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
