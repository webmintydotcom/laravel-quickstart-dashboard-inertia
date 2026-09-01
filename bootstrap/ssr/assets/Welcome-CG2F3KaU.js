import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { Blocks, Check, CheckIcon, ChevronDownIcon, ChevronRight, ChevronUpIcon, Code2, ExternalLink, Layers, Layout, Mail, Moon, Paintbrush, Rocket, Send, Settings, Sparkles, Sun, Terminal, Type, User, XIcon, Zap } from "lucide-react";
import { Accordion, Avatar, Checkbox, Dialog, Progress, Select, Separator, Slider, Slot, Switch, Tabs, Tooltip } from "radix-ui";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
//#region resources/js/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region resources/js/components/ui/accordion.tsx
function Accordion$1({ ...props }) {
	return /* @__PURE__ */ jsx(Accordion.Root, {
		"data-slot": "accordion",
		...props
	});
}
function AccordionItem({ className, ...props }) {
	return /* @__PURE__ */ jsx(Accordion.Item, {
		"data-slot": "accordion-item",
		className: cn("border-b last:border-b-0", className),
		...props
	});
}
function AccordionTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ jsx(Accordion.Header, {
		className: "flex",
		children: /* @__PURE__ */ jsxs(Accordion.Trigger, {
			"data-slot": "accordion-trigger",
			className: cn("focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180", className),
			...props,
			children: [children, /* @__PURE__ */ jsx(ChevronDownIcon, { className: "text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" })]
		})
	});
}
function AccordionContent({ className, children, ...props }) {
	return /* @__PURE__ */ jsx(Accordion.Content, {
		"data-slot": "accordion-content",
		className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm",
		...props,
		children: /* @__PURE__ */ jsx("div", {
			className: cn("pt-0 pb-4", className),
			children
		})
	});
}
//#endregion
//#region resources/js/components/ui/alert.tsx
var alertVariants = cva("relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current", {
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current"
	} },
	defaultVariants: { variant: "default" }
});
function Alert({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert",
		role: "alert",
		className: cn(alertVariants({ variant }), className),
		...props
	});
}
function AlertTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert-title",
		className: cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className),
		...props
	});
}
function AlertDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert-description",
		className: cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/avatar.tsx
function Avatar$1({ className, size = "default", ...props }) {
	return /* @__PURE__ */ jsx(Avatar.Root, {
		"data-slot": "avatar",
		"data-size": size,
		className: cn("group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6", className),
		...props
	});
}
function AvatarImage({ className, ...props }) {
	return /* @__PURE__ */ jsx(Avatar.Image, {
		"data-slot": "avatar-image",
		className: cn("aspect-square size-full", className),
		...props
	});
}
function AvatarFallback({ className, ...props }) {
	return /* @__PURE__ */ jsx(Avatar.Fallback, {
		"data-slot": "avatar-fallback",
		className: cn("bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/badge.tsx
var badgeVariants = cva("inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
		secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
		destructive: "bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
		outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
		ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
		link: "text-primary underline-offset-4 [a&]:hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant = "default", asChild = false, ...props }) {
	const Comp = asChild ? Slot.Root : "span";
	return /* @__PURE__ */ jsx(Comp, {
		"data-slot": "badge",
		"data-variant": variant,
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/button.tsx
var buttonVariants = cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
			outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2 has-[>svg]:px-3",
			xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
			lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
			icon: "size-9",
			"icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-8",
			"icon-lg": "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
	const Comp = asChild ? Slot.Root : "button";
	return /* @__PURE__ */ jsx(Comp, {
		"data-slot": "button",
		"data-variant": variant,
		"data-size": size,
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/card.tsx
function Card({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card",
		className: cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-header",
		className: cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-title",
		className: cn("leading-none font-semibold", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-content",
		className: cn("px-6", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/checkbox.tsx
function Checkbox$1({ className, ...props }) {
	return /* @__PURE__ */ jsx(Checkbox.Root, {
		"data-slot": "checkbox",
		className: cn("peer border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ jsx(Checkbox.Indicator, {
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none",
			children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
		})
	});
}
//#endregion
//#region resources/js/components/ui/dialog.tsx
function Dialog$1({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		"data-slot": "dialog",
		...props
	});
}
function DialogTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Trigger, {
		"data-slot": "dialog-trigger",
		...props
	});
}
function DialogPortal({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Portal, {
		"data-slot": "dialog-portal",
		...props
	});
}
function DialogOverlay({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Overlay, {
		"data-slot": "dialog-overlay",
		className: cn("data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", className),
		...props
	});
}
function DialogContent({ className, children, showCloseButton = true, ...props }) {
	return /* @__PURE__ */ jsxs(DialogPortal, {
		"data-slot": "dialog-portal",
		children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(Dialog.Content, {
			"data-slot": "dialog-content",
			className: cn("bg-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg", className),
			...props,
			children: [children, showCloseButton && /* @__PURE__ */ jsxs(Dialog.Close, {
				"data-slot": "dialog-close",
				className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				children: [/* @__PURE__ */ jsx(XIcon, {}), /* @__PURE__ */ jsx("span", {
					className: "sr-only",
					children: "Close"
				})]
			})]
		})]
	});
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2 text-center sm:text-left", className),
		...props
	});
}
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "dialog-footer",
		className: cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsx(Dialog.Close, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				children: "Close"
			})
		})]
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Title, {
		"data-slot": "dialog-title",
		className: cn("text-lg leading-none font-semibold", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Description, {
		"data-slot": "dialog-description",
		className: cn("text-muted-foreground text-sm", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/input.tsx
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		"data-slot": "input",
		className: cn("border-input selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/progress.tsx
function Progress$1({ className, value, ...props }) {
	return /* @__PURE__ */ jsx(Progress.Root, {
		"data-slot": "progress",
		className: cn("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className),
		...props,
		children: /* @__PURE__ */ jsx(Progress.Indicator, {
			"data-slot": "progress-indicator",
			className: "bg-primary h-full w-full flex-1 transition-all",
			style: { transform: `translateX(-${100 - (value || 0)}%)` }
		})
	});
}
//#endregion
//#region resources/js/components/ui/select.tsx
function Select$1({ ...props }) {
	return /* @__PURE__ */ jsx(Select.Root, {
		"data-slot": "select",
		...props
	});
}
function SelectValue({ ...props }) {
	return /* @__PURE__ */ jsx(Select.Value, {
		"data-slot": "select-value",
		...props
	});
}
function SelectTrigger({ className, size = "default", children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Trigger, {
		"data-slot": "select-trigger",
		"data-size": size,
		className: cn("border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='text-'])]:text-muted-foreground flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Select.Icon, {
			asChild: true,
			children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" })
		})]
	});
}
function SelectContent({ className, children, position = "item-aligned", align = "center", ...props }) {
	return /* @__PURE__ */ jsx(Select.Portal, { children: /* @__PURE__ */ jsxs(Select.Content, {
		"data-slot": "select-content",
		className: cn("bg-popover text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
		position,
		align,
		...props,
		children: [
			/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
			/* @__PURE__ */ jsx(Select.Viewport, {
				className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
				children
			}),
			/* @__PURE__ */ jsx(SelectScrollDownButton, {})
		]
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ jsxs(Select.Item, {
		"data-slot": "select-item",
		className: cn("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
		...props,
		children: [/* @__PURE__ */ jsx("span", {
			"data-slot": "select-item-indicator",
			className: "absolute right-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ jsx(Select.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) })
		}), /* @__PURE__ */ jsx(Select.ItemText, { children })]
	});
}
function SelectScrollUpButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollUpButton, {
		"data-slot": "select-scroll-up-button",
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
	});
}
function SelectScrollDownButton({ className, ...props }) {
	return /* @__PURE__ */ jsx(Select.ScrollDownButton, {
		"data-slot": "select-scroll-down-button",
		className: cn("flex cursor-default items-center justify-center py-1", className),
		...props,
		children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
	});
}
//#endregion
//#region resources/js/components/ui/separator.tsx
function Separator$1({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ jsx(Separator.Root, {
		"data-slot": "separator",
		decorative,
		orientation,
		className: cn("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/slider.tsx
function Slider$1({ className, defaultValue, value, min = 0, max = 100, ...props }) {
	const _values = React.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max], [
		value,
		defaultValue,
		min,
		max
	]);
	return /* @__PURE__ */ jsxs(Slider.Root, {
		"data-slot": "slider",
		defaultValue,
		value,
		min,
		max,
		className: cn("relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col", className),
		...props,
		children: [/* @__PURE__ */ jsx(Slider.Track, {
			"data-slot": "slider-track",
			className: cn("bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"),
			children: /* @__PURE__ */ jsx(Slider.Range, {
				"data-slot": "slider-range",
				className: cn("bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full")
			})
		}), Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsx(Slider.Thumb, {
			"data-slot": "slider-thumb",
			className: "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
		}, index))]
	});
}
//#endregion
//#region resources/js/components/ui/switch.tsx
function Switch$1({ className, size = "default", ...props }) {
	return /* @__PURE__ */ jsx(Switch.Root, {
		"data-slot": "switch",
		"data-size": size,
		className: cn("peer group/switch focus-visible:border-ring focus-visible:ring-ring/50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6", className),
		...props,
		children: /* @__PURE__ */ jsx(Switch.Thumb, {
			"data-slot": "switch-thumb",
			className: cn("bg-background dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")
		})
	});
}
//#endregion
//#region resources/js/components/ui/tabs.tsx
function Tabs$1({ className, orientation = "horizontal", ...props }) {
	return /* @__PURE__ */ jsx(Tabs.Root, {
		"data-slot": "tabs",
		"data-orientation": orientation,
		orientation,
		className: cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className),
		...props
	});
}
var tabsListVariants = cva("group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none", {
	variants: { variant: {
		default: "bg-muted",
		line: "gap-1 bg-transparent"
	} },
	defaultVariants: { variant: "default" }
});
function TabsList({ className, variant = "default", ...props }) {
	return /* @__PURE__ */ jsx(Tabs.List, {
		"data-slot": "tabs-list",
		"data-variant": variant,
		className: cn(tabsListVariants({ variant }), className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ jsx(Tabs.Trigger, {
		"data-slot": "tabs-trigger",
		className: cn("text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent", "data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground", "after:bg-foreground after:absolute after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ jsx(Tabs.Content, {
		"data-slot": "tabs-content",
		className: cn("flex-1 outline-none", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/textarea.tsx
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ jsx("textarea", {
		"data-slot": "textarea",
		className: cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		...props
	});
}
//#endregion
//#region resources/js/components/ui/tooltip.tsx
function TooltipProvider({ delayDuration = 0, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		...props
	});
}
function Tooltip$1({ ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Root, {
		"data-slot": "tooltip",
		...props
	});
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Trigger, {
		"data-slot": "tooltip-trigger",
		...props
	});
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip.Portal, { children: /* @__PURE__ */ jsxs(Tooltip.Content, {
		"data-slot": "tooltip-content",
		sideOffset,
		className: cn("animate-in bg-foreground text-background fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(Tooltip.Arrow, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })]
	}) });
}
//#endregion
//#region resources/js/Pages/Welcome.tsx
var techStack = [
	{
		icon: Layers,
		title: "Laravel 12",
		description: "The PHP framework for artisans. Elegant syntax, powerful ORM, and seamless API integration.",
		href: "https://laravel.com/docs",
		color: "text-red-500"
	},
	{
		icon: Zap,
		title: "Inertia.js",
		description: "Build SPAs without an API. Connects your Laravel backend directly to your React frontend.",
		href: "https://inertiajs.com",
		color: "text-purple-500"
	},
	{
		icon: Blocks,
		title: "React 19",
		description: "The library for building user interfaces with components, hooks, and the latest concurrent features.",
		href: "https://react.dev",
		color: "text-blue-500"
	},
	{
		icon: Paintbrush,
		title: "Tailwind CSS v4",
		description: "Utility-first CSS with a brand new engine. Faster builds, modern CSS features, and zero config.",
		href: "https://tailwindcss.com",
		color: "text-cyan-500"
	},
	{
		icon: Layout,
		title: "Shadcn UI",
		description: "Beautifully designed, accessible components you own. Built on Radix primitives and Tailwind.",
		href: "https://ui.shadcn.com",
		color: "text-emerald-500"
	},
	{
		icon: Type,
		title: "TypeScript",
		description: "Type-safe development with full IDE support. Catch bugs before they reach production.",
		href: "https://www.typescriptlang.org",
		color: "text-blue-600"
	}
];
var faqItems = [
	{
		question: "How do I add new shadcn/ui components?",
		answer: "Run npx shadcn@latest add [component-name] to install any component. They are copied directly into your project so you can customize them however you like."
	},
	{
		question: "How does Inertia.js routing work?",
		answer: "Define routes in routes/web.php as you normally would with Laravel. Use Inertia::render() to return React page components. No separate API needed!"
	},
	{
		question: "Can I use server-side rendering?",
		answer: "Yes! This template is SSR-ready. Run npm run build:ssr to build with server-side rendering support for improved SEO and performance."
	},
	{
		question: "How do I customize the theme?",
		answer: "Edit the CSS variables in resources/css/app.css. The theme uses OKLch color space with semantic tokens for light and dark mode. All shadcn/ui components respect these tokens."
	}
];
function GithubIcon({ className }) {
	return /* @__PURE__ */ jsx("svg", {
		xmlns: "http://www.w3.org/2000/svg",
		viewBox: "0 0 24 24",
		fill: "currentColor",
		"aria-hidden": "true",
		className,
		children: /* @__PURE__ */ jsx("path", { d: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" })
	});
}
function Welcome() {
	const [darkMode, setDarkMode] = useState(false);
	const [progressValue, setProgressValue] = useState(68);
	const [sliderValue, setSliderValue] = useState([50]);
	const [switchChecked, setSwitchChecked] = useState(true);
	function toggleDarkMode() {
		setDarkMode(!darkMode);
		document.documentElement.classList.toggle("dark");
	}
	return /* @__PURE__ */ jsxs(TooltipProvider, { children: [/* @__PURE__ */ jsx(Head, { title: "Welcome" }), /* @__PURE__ */ jsxs("div", {
		className: "bg-background min-h-screen",
		children: [
			/* @__PURE__ */ jsx("header", {
				className: "bg-background/80 sticky top-0 z-50 border-b backdrop-blur-lg",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-lg",
							children: /* @__PURE__ */ jsx(Terminal, { className: "h-4 w-4" })
						}), /* @__PURE__ */ jsx("span", {
							className: "text-foreground text-lg font-semibold tracking-tight",
							children: "Laravel Quickstart"
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsxs(Tooltip$1, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								asChild: true,
								children: /* @__PURE__ */ jsx("a", {
									href: "https://github.com/webminty/laravel-quickstart-inertia",
									target: "_blank",
									rel: "noopener noreferrer",
									"aria-label": "View on GitHub",
									children: /* @__PURE__ */ jsx(GithubIcon, { className: "h-4 w-4" })
								})
							})
						}), /* @__PURE__ */ jsx(TooltipContent, { children: "View on GitHub" })] }), /* @__PURE__ */ jsxs(Tooltip$1, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								onClick: toggleDarkMode,
								"aria-label": "Toggle dark mode",
								children: darkMode ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ jsx(TooltipContent, { children: darkMode ? "Switch to light mode" : "Switch to dark mode" })] })]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "relative overflow-hidden",
				children: [/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 -z-10",
					children: /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl" })
				}), /* @__PURE__ */ jsx("div", {
					className: "mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28",
					children: /* @__PURE__ */ jsxs("div", {
						className: "mx-auto max-w-3xl",
						children: [
							/* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: "mb-6 gap-1.5 px-3 py-1",
								children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }), "React + Inertia.js + Shadcn UI + Tailwind v4"]
							}),
							/* @__PURE__ */ jsxs("h1", {
								className: "text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
								children: [
									"Build modern apps",
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400",
										children: "beautifully fast"
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed",
								children: "A quickstart template with everything pre-configured. Laravel backend, React frontend, beautiful UI components, and a world-class developer experience."
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-10 flex flex-wrap items-center justify-center gap-3",
								children: [/* @__PURE__ */ jsx(Button, {
									size: "lg",
									asChild: true,
									children: /* @__PURE__ */ jsxs("a", {
										href: "https://laravel.com/docs",
										children: ["Get Started", /* @__PURE__ */ jsx(ChevronRight, { className: "ml-1 h-4 w-4" })]
									})
								}), /* @__PURE__ */ jsx(Button, {
									size: "lg",
									variant: "outline",
									asChild: true,
									children: /* @__PURE__ */ jsxs("a", {
										href: "https://github.com/webminty/laravel-quickstart-inertia",
										target: "_blank",
										rel: "noopener noreferrer",
										children: [/* @__PURE__ */ jsx(GithubIcon, { className: "mr-2 h-4 w-4" }), "View Source"]
									})
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ jsxs("section", {
				className: "mx-auto max-w-6xl px-6 pb-20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-10 text-center",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-foreground text-2xl font-bold tracking-tight sm:text-3xl",
						children: "Everything you need"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-muted-foreground mt-2",
						children: "A curated set of best-in-class technologies, ready to go."
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: techStack.map((item) => /* @__PURE__ */ jsx("a", {
						href: item.href,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "group",
						children: /* @__PURE__ */ jsxs(Card, {
							className: "hover:bg-accent/50 h-full transition-colors",
							children: [/* @__PURE__ */ jsx(CardHeader, {
								className: "pb-3",
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "bg-background flex h-10 w-10 items-center justify-center rounded-lg border",
										children: /* @__PURE__ */ jsx(item.icon, { className: `h-5 w-5 ${item.color}` })
									}), /* @__PURE__ */ jsxs(CardTitle, {
										className: "flex items-center gap-2 text-base",
										children: [item.title, /* @__PURE__ */ jsx(ExternalLink, { className: "text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" })]
									})]
								})
							}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(CardDescription, {
								className: "text-sm leading-relaxed",
								children: item.description
							}) })]
						})
					}, item.title))
				})]
			}),
			/* @__PURE__ */ jsx(Separator$1, { className: "mx-auto max-w-6xl" }),
			/* @__PURE__ */ jsxs("section", {
				className: "mx-auto max-w-6xl px-6 py-20",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-10 text-center",
					children: [
						/* @__PURE__ */ jsxs(Badge, {
							variant: "outline",
							className: "mb-4",
							children: [/* @__PURE__ */ jsx(Code2, { className: "mr-1.5 h-3 w-3" }), "Component Showcase"]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-foreground text-2xl font-bold tracking-tight sm:text-3xl",
							children: "Beautiful, accessible components"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground mt-2",
							children: "Explore the shadcn/ui components included in this template."
						})
					]
				}), /* @__PURE__ */ jsxs(Tabs$1, {
					defaultValue: "inputs",
					className: "w-full",
					children: [
						/* @__PURE__ */ jsxs(TabsList, {
							className: "mx-auto mb-8 grid w-full max-w-lg grid-cols-3",
							children: [
								/* @__PURE__ */ jsx(TabsTrigger, {
									value: "inputs",
									children: "Inputs"
								}),
								/* @__PURE__ */ jsx(TabsTrigger, {
									value: "display",
									children: "Display"
								}),
								/* @__PURE__ */ jsx(TabsTrigger, {
									value: "feedback",
									children: "Feedback"
								})
							]
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "inputs",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid gap-6 lg:grid-cols-2",
								children: [
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Buttons"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Multiple variants, sizes, and states." })] }), /* @__PURE__ */ jsxs(CardContent, {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex flex-wrap gap-2",
												children: [
													/* @__PURE__ */ jsx(Button, { children: "Primary" }),
													/* @__PURE__ */ jsx(Button, {
														variant: "secondary",
														children: "Secondary"
													}),
													/* @__PURE__ */ jsx(Button, {
														variant: "outline",
														children: "Outline"
													}),
													/* @__PURE__ */ jsx(Button, {
														variant: "ghost",
														children: "Ghost"
													}),
													/* @__PURE__ */ jsx(Button, {
														variant: "destructive",
														children: "Destructive"
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex flex-wrap items-center gap-2",
												children: [
													/* @__PURE__ */ jsx(Button, {
														size: "sm",
														children: "Small"
													}),
													/* @__PURE__ */ jsx(Button, {
														size: "default",
														children: "Default"
													}),
													/* @__PURE__ */ jsx(Button, {
														size: "lg",
														children: "Large"
													}),
													/* @__PURE__ */ jsx(Button, {
														size: "icon",
														"aria-label": "Settings",
														children: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" })
													})
												]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "flex flex-wrap gap-2",
												children: [/* @__PURE__ */ jsx(Button, {
													disabled: true,
													children: "Disabled"
												}), /* @__PURE__ */ jsxs(Button, { children: [/* @__PURE__ */ jsx(Rocket, { className: "mr-2 h-4 w-4" }), "With Icon"] })]
											})
										]
									})] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Form Controls"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Inputs, selects, checkboxes, and more." })] }), /* @__PURE__ */ jsxs(CardContent, {
										className: "space-y-4",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ jsx("label", {
													htmlFor: "demo-email",
													className: "text-foreground text-sm font-medium",
													children: "Email"
												}), /* @__PURE__ */ jsx(Input, {
													id: "demo-email",
													type: "email",
													placeholder: "you@example.com"
												})]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ jsx("label", {
													htmlFor: "demo-select",
													className: "text-foreground text-sm font-medium",
													children: "Framework"
												}), /* @__PURE__ */ jsxs(Select$1, { children: [/* @__PURE__ */ jsx(SelectTrigger, {
													id: "demo-select",
													children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select a framework" })
												}), /* @__PURE__ */ jsxs(SelectContent, { children: [
													/* @__PURE__ */ jsx(SelectItem, {
														value: "laravel",
														children: "Laravel"
													}),
													/* @__PURE__ */ jsx(SelectItem, {
														value: "rails",
														children: "Ruby on Rails"
													}),
													/* @__PURE__ */ jsx(SelectItem, {
														value: "django",
														children: "Django"
													}),
													/* @__PURE__ */ jsx(SelectItem, {
														value: "nextjs",
														children: "Next.js"
													})
												] })] })]
											}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ jsx("label", {
													htmlFor: "demo-message",
													className: "text-foreground text-sm font-medium",
													children: "Message"
												}), /* @__PURE__ */ jsx(Textarea, {
													id: "demo-message",
													placeholder: "Type your message...",
													rows: 3
												})]
											})
										]
									})] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Toggles & Sliders"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Interactive controls with live state." })] }), /* @__PURE__ */ jsxs(CardContent, {
										className: "space-y-6",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "space-y-0.5",
													children: [/* @__PURE__ */ jsx("label", {
														htmlFor: "notifications-switch",
														className: "text-foreground text-sm font-medium",
														children: "Enable notifications"
													}), /* @__PURE__ */ jsx("p", {
														className: "text-muted-foreground text-xs",
														children: "Receive email updates about your account."
													})]
												}), /* @__PURE__ */ jsx(Switch$1, {
													id: "notifications-switch",
													checked: switchChecked,
													onCheckedChange: setSwitchChecked
												})]
											}),
											/* @__PURE__ */ jsx(Separator$1, {}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-3",
												children: [/* @__PURE__ */ jsxs("div", {
													className: "flex items-center justify-between",
													children: [/* @__PURE__ */ jsx("label", {
														htmlFor: "volume-slider",
														className: "text-foreground text-sm font-medium",
														children: "Volume"
													}), /* @__PURE__ */ jsxs("span", {
														className: "text-muted-foreground text-sm tabular-nums",
														children: [sliderValue[0], "%"]
													})]
												}), /* @__PURE__ */ jsx(Slider$1, {
													id: "volume-slider",
													value: sliderValue,
													onValueChange: setSliderValue,
													max: 100,
													step: 1
												})]
											}),
											/* @__PURE__ */ jsx(Separator$1, {}),
											/* @__PURE__ */ jsxs("div", {
												className: "space-y-3",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-foreground text-sm font-medium",
													children: "Preferences"
												}), /* @__PURE__ */ jsxs("div", {
													className: "flex flex-col gap-3",
													children: [
														/* @__PURE__ */ jsxs("label", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ jsx(Checkbox$1, {
																defaultChecked: true,
																id: "pref-1"
															}), /* @__PURE__ */ jsx("span", {
																className: "text-foreground text-sm",
																children: "Receive marketing emails"
															})]
														}),
														/* @__PURE__ */ jsxs("label", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ jsx(Checkbox$1, { id: "pref-2" }), /* @__PURE__ */ jsx("span", {
																className: "text-foreground text-sm",
																children: "Enable two-factor auth"
															})]
														}),
														/* @__PURE__ */ jsxs("label", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ jsx(Checkbox$1, {
																defaultChecked: true,
																id: "pref-3"
															}), /* @__PURE__ */ jsx("span", {
																className: "text-foreground text-sm",
																children: "Show online status"
															})]
														})
													]
												})]
											})
										]
									})] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Dialog"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Modal dialogs for confirmations and forms." })] }), /* @__PURE__ */ jsxs(CardContent, {
										className: "space-y-4",
										children: [/* @__PURE__ */ jsxs(Dialog$1, { children: [/* @__PURE__ */ jsx(DialogTrigger, {
											asChild: true,
											children: /* @__PURE__ */ jsxs(Button, {
												variant: "outline",
												children: [/* @__PURE__ */ jsx(Mail, { className: "mr-2 h-4 w-4" }), "Open Contact Form"]
											})
										}), /* @__PURE__ */ jsxs(DialogContent, {
											className: "sm:max-w-md",
											children: [
												/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Get in touch" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Send us a message and we'll get back to you soon." })] }),
												/* @__PURE__ */ jsxs("div", {
													className: "space-y-4 py-4",
													children: [
														/* @__PURE__ */ jsxs("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ jsx("label", {
																htmlFor: "dialog-name",
																className: "text-sm font-medium",
																children: "Name"
															}), /* @__PURE__ */ jsx(Input, {
																id: "dialog-name",
																placeholder: "Your name"
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ jsx("label", {
																htmlFor: "dialog-email",
																className: "text-sm font-medium",
																children: "Email"
															}), /* @__PURE__ */ jsx(Input, {
																id: "dialog-email",
																type: "email",
																placeholder: "you@example.com"
															})]
														}),
														/* @__PURE__ */ jsxs("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ jsx("label", {
																htmlFor: "dialog-message",
																className: "text-sm font-medium",
																children: "Message"
															}), /* @__PURE__ */ jsx(Textarea, {
																id: "dialog-message",
																placeholder: "How can we help?",
																rows: 4
															})]
														})
													]
												}),
												/* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, {
													type: "submit",
													children: [/* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }), "Send Message"]
												}) })
											]
										})] }), /* @__PURE__ */ jsx("p", {
											className: "text-muted-foreground text-sm",
											children: "Click the button above to open an interactive dialog with form controls."
										})]
									})] })
								]
							})
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "display",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid gap-6 lg:grid-cols-2",
								children: [
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Badges"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Status indicators and labels." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", {
										className: "flex flex-wrap gap-2",
										children: [
											/* @__PURE__ */ jsx(Badge, { children: "Default" }),
											/* @__PURE__ */ jsx(Badge, {
												variant: "secondary",
												children: "Secondary"
											}),
											/* @__PURE__ */ jsx(Badge, {
												variant: "outline",
												children: "Outline"
											}),
											/* @__PURE__ */ jsx(Badge, {
												variant: "destructive",
												children: "Destructive"
											}),
											/* @__PURE__ */ jsxs(Badge, {
												variant: "secondary",
												className: "gap-1",
												children: [/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }), "Success"]
											}),
											/* @__PURE__ */ jsxs(Badge, {
												variant: "outline",
												className: "gap-1",
												children: [/* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), "New"]
											})
										]
									}) })] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Avatars"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "User profile images with fallbacks." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-4",
										children: [
											/* @__PURE__ */ jsxs(Avatar$1, {
												className: "h-12 w-12",
												children: [/* @__PURE__ */ jsx(AvatarImage, {
													src: "https://api.dicebear.com/9.x/initials/svg?seed=JD&backgroundType=gradientLinear",
													alt: "John Doe"
												}), /* @__PURE__ */ jsx(AvatarFallback, { children: "JD" })]
											}),
											/* @__PURE__ */ jsxs(Avatar$1, {
												className: "h-12 w-12",
												children: [/* @__PURE__ */ jsx(AvatarImage, {
													src: "https://api.dicebear.com/9.x/initials/svg?seed=AS&backgroundType=gradientLinear",
													alt: "Alice Smith"
												}), /* @__PURE__ */ jsx(AvatarFallback, { children: "AS" })]
											}),
											/* @__PURE__ */ jsxs(Avatar$1, {
												className: "h-12 w-12",
												children: [/* @__PURE__ */ jsx(AvatarImage, {
													src: "https://api.dicebear.com/9.x/initials/svg?seed=MJ&backgroundType=gradientLinear",
													alt: "Michael Johnson"
												}), /* @__PURE__ */ jsx(AvatarFallback, { children: "MJ" })]
											}),
											/* @__PURE__ */ jsx(Avatar$1, {
												className: "h-12 w-12",
												children: /* @__PURE__ */ jsx(AvatarFallback, { children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5" }) })
											})
										]
									}) })] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Card Layouts"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Flexible containers for any content." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
										className: "space-y-3",
										children: [
											{
												name: "Design System",
												desc: "Create tokens and components",
												badge: "In Progress",
												variant: "secondary"
											},
											{
												name: "API Integration",
												desc: "Connect backend services",
												badge: "Complete",
												variant: "default"
											},
											{
												name: "Performance Audit",
												desc: "Optimize bundle size",
												badge: "Planned",
												variant: "outline"
											}
										].map((task) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-center justify-between rounded-lg border p-3",
											children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
												className: "text-foreground text-sm font-medium",
												children: task.name
											}), /* @__PURE__ */ jsx("p", {
												className: "text-muted-foreground text-xs",
												children: task.desc
											})] }), /* @__PURE__ */ jsx(Badge, {
												variant: task.variant,
												children: task.badge
											})]
										}, task.name))
									}) })] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Team Members"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Combine avatars, text, and badges." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
										className: "space-y-4",
										children: [
											{
												name: "Sarah Chen",
												role: "Lead Designer",
												initials: "SC"
											},
											{
												name: "Marcus Rivera",
												role: "Full Stack Dev",
												initials: "MR"
											},
											{
												name: "Priya Patel",
												role: "Product Manager",
												initials: "PP"
											}
										].map((member) => /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [
												/* @__PURE__ */ jsxs(Avatar$1, { children: [/* @__PURE__ */ jsx(AvatarImage, {
													src: `https://api.dicebear.com/9.x/initials/svg?seed=${member.initials}&backgroundType=gradientLinear`,
													alt: member.name
												}), /* @__PURE__ */ jsx(AvatarFallback, { children: member.initials })] }),
												/* @__PURE__ */ jsxs("div", {
													className: "flex-1",
													children: [/* @__PURE__ */ jsx("p", {
														className: "text-foreground text-sm font-medium",
														children: member.name
													}), /* @__PURE__ */ jsx("p", {
														className: "text-muted-foreground text-xs",
														children: member.role
													})]
												}),
												/* @__PURE__ */ jsx(Badge, {
													variant: "secondary",
													children: "Active"
												})
											]
										}, member.name))
									}) })] })
								]
							})
						}),
						/* @__PURE__ */ jsx(TabsContent, {
							value: "feedback",
							children: /* @__PURE__ */ jsxs("div", {
								className: "grid gap-6 lg:grid-cols-2",
								children: [
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Progress"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Track completion and loading states." })] }), /* @__PURE__ */ jsxs(CardContent, {
										className: "space-y-6",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ jsxs("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-foreground",
													children: "Project completion"
												}), /* @__PURE__ */ jsxs("span", {
													className: "text-muted-foreground tabular-nums",
													children: [progressValue, "%"]
												})]
											}), /* @__PURE__ */ jsx(Progress$1, { value: progressValue })]
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex gap-2",
											children: [
												/* @__PURE__ */ jsx(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setProgressValue(Math.max(0, progressValue - 10)),
													children: "-10%"
												}),
												/* @__PURE__ */ jsx(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setProgressValue(Math.min(100, progressValue + 10)),
													children: "+10%"
												}),
												/* @__PURE__ */ jsx(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setProgressValue(100),
													children: "Complete"
												})
											]
										})]
									})] }),
									/* @__PURE__ */ jsxs(Card, { children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
										className: "text-base",
										children: "Alerts"
									}), /* @__PURE__ */ jsx(CardDescription, { children: "Informational and status messages." })] }), /* @__PURE__ */ jsxs(CardContent, {
										className: "space-y-3",
										children: [/* @__PURE__ */ jsxs(Alert, { children: [
											/* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4" }),
											/* @__PURE__ */ jsx(AlertTitle, { children: "Ready to launch!" }),
											/* @__PURE__ */ jsx(AlertDescription, { children: "Your application is configured and ready to deploy." })
										] }), /* @__PURE__ */ jsxs(Alert, {
											variant: "destructive",
											children: [/* @__PURE__ */ jsx(AlertTitle, { children: "Breaking change" }), /* @__PURE__ */ jsx(AlertDescription, { children: "Please update your API keys before the next release." })]
										})]
									})] }),
									/* @__PURE__ */ jsxs(Card, {
										className: "lg:col-span-2",
										children: [/* @__PURE__ */ jsxs(CardHeader, { children: [/* @__PURE__ */ jsx(CardTitle, {
											className: "text-base",
											children: "Tooltips"
										}), /* @__PURE__ */ jsx(CardDescription, { children: "Contextual information on hover." })] }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", {
											className: "flex flex-wrap gap-2",
											children: [
												{
													label: "Edit",
													tip: "Edit this item"
												},
												{
													label: "Share",
													tip: "Share with your team"
												},
												{
													label: "Export",
													tip: "Download as CSV"
												},
												{
													label: "Archive",
													tip: "Move to archive"
												},
												{
													label: "Duplicate",
													tip: "Create a copy"
												}
											].map((item) => /* @__PURE__ */ jsxs(Tooltip$1, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
												asChild: true,
												children: /* @__PURE__ */ jsx(Button, {
													variant: "outline",
													children: item.label
												})
											}), /* @__PURE__ */ jsx(TooltipContent, { children: item.tip })] }, item.label))
										}) })]
									})
								]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx(Separator$1, { className: "mx-auto max-w-6xl" }),
			/* @__PURE__ */ jsx("section", {
				className: "mx-auto max-w-6xl px-6 py-20",
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid gap-10 lg:grid-cols-[1fr_1.5fr]",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx(Badge, {
							variant: "outline",
							className: "mb-4",
							children: "FAQ"
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-foreground text-2xl font-bold tracking-tight sm:text-3xl",
							children: "Common questions"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-muted-foreground mt-2",
							children: "Quick answers to help you get started with this template."
						})
					] }), /* @__PURE__ */ jsx(Accordion$1, {
						type: "single",
						collapsible: true,
						defaultValue: "item-0",
						className: "w-full",
						children: faqItems.map((item, index) => /* @__PURE__ */ jsxs(AccordionItem, {
							value: `item-${index}`,
							children: [/* @__PURE__ */ jsx(AccordionTrigger, { children: item.question }), /* @__PURE__ */ jsx(AccordionContent, { children: item.answer })]
						}, index))
					})]
				})
			}),
			/* @__PURE__ */ jsx("footer", {
				className: "border-t",
				children: /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "text-muted-foreground flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ jsx(Terminal, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "Laravel v12 + React 19 + Inertia.js + Shadcn UI + Tailwind v4" })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ jsx("a", {
								href: "https://laravel.com/docs",
								target: "_blank",
								rel: "noopener noreferrer",
								children: "Docs"
							})
						}), /* @__PURE__ */ jsx(Button, {
							size: "sm",
							variant: "ghost",
							asChild: true,
							children: /* @__PURE__ */ jsx("a", {
								href: "https://github.com/webminty/laravel-quickstart-inertia",
								target: "_blank",
								rel: "noopener noreferrer",
								children: "GitHub"
							})
						})]
					})]
				})
			})
		]
	})] });
}
//#endregion
export { Welcome as default };

//# sourceMappingURL=Welcome-CG2F3KaU.js.map