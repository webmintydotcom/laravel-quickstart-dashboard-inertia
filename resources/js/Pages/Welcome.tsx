import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Blocks,
    Check,
    ChevronRight,
    Code2,
    ExternalLink,
    Layers,
    Layout,
    Mail,
    Moon,
    Paintbrush,
    Rocket,
    Send,
    Settings,
    Sparkles,
    Sun,
    Terminal,
    Type,
    User,
    Zap,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const techStack = [
    {
        icon: Layers,
        title: 'Laravel 12',
        description: 'The PHP framework for artisans. Elegant syntax, powerful ORM, and seamless API integration.',
        href: 'https://laravel.com/docs',
        color: 'text-red-500',
    },
    {
        icon: Zap,
        title: 'Inertia.js',
        description: 'Build SPAs without an API. Connects your Laravel backend directly to your React frontend.',
        href: 'https://inertiajs.com',
        color: 'text-purple-500',
    },
    {
        icon: Blocks,
        title: 'React 19',
        description:
            'The library for building user interfaces with components, hooks, and the latest concurrent features.',
        href: 'https://react.dev',
        color: 'text-blue-500',
    },
    {
        icon: Paintbrush,
        title: 'Tailwind CSS v4',
        description: 'Utility-first CSS with a brand new engine. Faster builds, modern CSS features, and zero config.',
        href: 'https://tailwindcss.com',
        color: 'text-cyan-500',
    },
    {
        icon: Layout,
        title: 'Shadcn UI',
        description: 'Beautifully designed, accessible components you own. Built on Radix primitives and Tailwind.',
        href: 'https://ui.shadcn.com',
        color: 'text-emerald-500',
    },
    {
        icon: Type,
        title: 'TypeScript',
        description: 'Type-safe development with full IDE support. Catch bugs before they reach production.',
        href: 'https://www.typescriptlang.org',
        color: 'text-blue-600',
    },
];

const faqItems = [
    {
        question: 'How do I add new shadcn/ui components?',
        answer: 'Run npx shadcn@latest add [component-name] to install any component. They are copied directly into your project so you can customize them however you like.',
    },
    {
        question: 'How does Inertia.js routing work?',
        answer: 'Define routes in routes/web.php as you normally would with Laravel. Use Inertia::render() to return React page components. No separate API needed!',
    },
    {
        question: 'Can I use server-side rendering?',
        answer: 'Yes! This template is SSR-ready. Run npm run build:ssr to build with server-side rendering support for improved SEO and performance.',
    },
    {
        question: 'How do I customize the theme?',
        answer: 'Edit the CSS variables in resources/css/app.css. The theme uses OKLch color space with semantic tokens for light and dark mode. All shadcn/ui components respect these tokens.',
    },
];

function GithubIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
        </svg>
    );
}

export default function Welcome() {
    const [darkMode, setDarkMode] = useState(false);
    const [progressValue, setProgressValue] = useState(68);
    const [sliderValue, setSliderValue] = useState([50]);
    const [switchChecked, setSwitchChecked] = useState(true);

    function toggleDarkMode() {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    }

    return (
        <TooltipProvider>
            <Head title="Welcome" />
            <div className="bg-background min-h-screen">
                {/* ── Navigation ── */}
                <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-lg">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-foreground text-background flex h-9 w-9 items-center justify-center rounded-lg">
                                <Terminal className="h-4 w-4" />
                            </div>
                            <span className="text-foreground text-lg font-semibold tracking-tight">
                                Laravel Quickstart
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" asChild>
                                        <a
                                            href="https://github.com/webminty/laravel-quickstart-inertia"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="View on GitHub"
                                        >
                                            <GithubIcon className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>View on GitHub</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={toggleDarkMode}
                                        aria-label="Toggle dark mode"
                                    >
                                        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </header>

                {/* ── Hero Section ── */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 blur-3xl" />
                    </div>
                    <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
                        <div className="mx-auto max-w-3xl">
                            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
                                <Sparkles className="h-3.5 w-3.5" />
                                React + Inertia.js + Shadcn UI + Tailwind v4
                            </Badge>
                            <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                Build modern apps{' '}
                                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400">
                                    beautifully fast
                                </span>
                            </h1>
                            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
                                A quickstart template with everything pre-configured. Laravel backend, React frontend,
                                beautiful UI components, and a world-class developer experience.
                            </p>
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                                <Button size="lg" asChild>
                                    <a href="https://laravel.com/docs">
                                        Get Started
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <a
                                        href="https://github.com/webminty/laravel-quickstart-inertia"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <GithubIcon className="mr-2 h-4 w-4" />
                                        View Source
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Tech Stack Cards ── */}
                <section className="mx-auto max-w-6xl px-6 pb-20">
                    <div className="mb-10 text-center">
                        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                            Everything you need
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            A curated set of best-in-class technologies, ready to go.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {techStack.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <Card className="hover:bg-accent/50 h-full transition-colors">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-background flex h-10 w-10 items-center justify-center rounded-lg border">
                                                <item.icon className={`h-5 w-5 ${item.color}`} />
                                            </div>
                                            <CardTitle className="flex items-center gap-2 text-base">
                                                {item.title}
                                                <ExternalLink className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm leading-relaxed">
                                            {item.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                </section>

                <Separator className="mx-auto max-w-6xl" />

                {/* ── Component Showcase ── */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-10 text-center">
                        <Badge variant="outline" className="mb-4">
                            <Code2 className="mr-1.5 h-3 w-3" />
                            Component Showcase
                        </Badge>
                        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                            Beautiful, accessible components
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Explore the shadcn/ui components included in this template.
                        </p>
                    </div>

                    <Tabs defaultValue="inputs" className="w-full">
                        <TabsList className="mx-auto mb-8 grid w-full max-w-lg grid-cols-3">
                            <TabsTrigger value="inputs">Inputs</TabsTrigger>
                            <TabsTrigger value="display">Display</TabsTrigger>
                            <TabsTrigger value="feedback">Feedback</TabsTrigger>
                        </TabsList>

                        {/* ── Inputs Tab ── */}
                        <TabsContent value="inputs">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Buttons & Variants */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Buttons</CardTitle>
                                        <CardDescription>Multiple variants, sizes, and states.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Button>Primary</Button>
                                            <Button variant="secondary">Secondary</Button>
                                            <Button variant="outline">Outline</Button>
                                            <Button variant="ghost">Ghost</Button>
                                            <Button variant="destructive">Destructive</Button>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button size="sm">Small</Button>
                                            <Button size="default">Default</Button>
                                            <Button size="lg">Large</Button>
                                            <Button size="icon" aria-label="Settings">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button disabled>Disabled</Button>
                                            <Button>
                                                <Rocket className="mr-2 h-4 w-4" />
                                                With Icon
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Form Controls */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Form Controls</CardTitle>
                                        <CardDescription>Inputs, selects, checkboxes, and more.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="demo-email" className="text-foreground text-sm font-medium">
                                                Email
                                            </label>
                                            <Input id="demo-email" type="email" placeholder="you@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="demo-select"
                                                className="text-foreground text-sm font-medium"
                                            >
                                                Framework
                                            </label>
                                            <Select>
                                                <SelectTrigger id="demo-select">
                                                    <SelectValue placeholder="Select a framework" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="laravel">Laravel</SelectItem>
                                                    <SelectItem value="rails">Ruby on Rails</SelectItem>
                                                    <SelectItem value="django">Django</SelectItem>
                                                    <SelectItem value="nextjs">Next.js</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="demo-message"
                                                className="text-foreground text-sm font-medium"
                                            >
                                                Message
                                            </label>
                                            <Textarea id="demo-message" placeholder="Type your message..." rows={3} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Toggles & Sliders */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Toggles & Sliders</CardTitle>
                                        <CardDescription>Interactive controls with live state.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <label
                                                    htmlFor="notifications-switch"
                                                    className="text-foreground text-sm font-medium"
                                                >
                                                    Enable notifications
                                                </label>
                                                <p className="text-muted-foreground text-xs">
                                                    Receive email updates about your account.
                                                </p>
                                            </div>
                                            <Switch
                                                id="notifications-switch"
                                                checked={switchChecked}
                                                onCheckedChange={setSwitchChecked}
                                            />
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <label
                                                    htmlFor="volume-slider"
                                                    className="text-foreground text-sm font-medium"
                                                >
                                                    Volume
                                                </label>
                                                <span className="text-muted-foreground text-sm tabular-nums">
                                                    {sliderValue[0]}%
                                                </span>
                                            </div>
                                            <Slider
                                                id="volume-slider"
                                                value={sliderValue}
                                                onValueChange={setSliderValue}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <span className="text-foreground text-sm font-medium">Preferences</span>
                                            <div className="flex flex-col gap-3">
                                                <label className="flex items-center gap-2">
                                                    <Checkbox defaultChecked id="pref-1" />
                                                    <span className="text-foreground text-sm">
                                                        Receive marketing emails
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <Checkbox id="pref-2" />
                                                    <span className="text-foreground text-sm">
                                                        Enable two-factor auth
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <Checkbox defaultChecked id="pref-3" />
                                                    <span className="text-foreground text-sm">Show online status</span>
                                                </label>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Dialog */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Dialog</CardTitle>
                                        <CardDescription>Modal dialogs for confirmations and forms.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Open Contact Form
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Get in touch</DialogTitle>
                                                    <DialogDescription>
                                                        Send us a message and we&apos;ll get back to you soon.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <label htmlFor="dialog-name" className="text-sm font-medium">
                                                            Name
                                                        </label>
                                                        <Input id="dialog-name" placeholder="Your name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="dialog-email" className="text-sm font-medium">
                                                            Email
                                                        </label>
                                                        <Input
                                                            id="dialog-email"
                                                            type="email"
                                                            placeholder="you@example.com"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label htmlFor="dialog-message" className="text-sm font-medium">
                                                            Message
                                                        </label>
                                                        <Textarea
                                                            id="dialog-message"
                                                            placeholder="How can we help?"
                                                            rows={4}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit">
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Send Message
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <p className="text-muted-foreground text-sm">
                                            Click the button above to open an interactive dialog with form controls.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* ── Display Tab ── */}
                        <TabsContent value="display">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Badges */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Badges</CardTitle>
                                        <CardDescription>Status indicators and labels.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            <Badge>Default</Badge>
                                            <Badge variant="secondary">Secondary</Badge>
                                            <Badge variant="outline">Outline</Badge>
                                            <Badge variant="destructive">Destructive</Badge>
                                            <Badge variant="secondary" className="gap-1">
                                                <Check className="h-3 w-3" />
                                                Success
                                            </Badge>
                                            <Badge variant="outline" className="gap-1">
                                                <Sparkles className="h-3 w-3" />
                                                New
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Avatars */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Avatars</CardTitle>
                                        <CardDescription>User profile images with fallbacks.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src="https://api.dicebear.com/9.x/initials/svg?seed=JD&backgroundType=gradientLinear"
                                                    alt="John Doe"
                                                />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src="https://api.dicebear.com/9.x/initials/svg?seed=AS&backgroundType=gradientLinear"
                                                    alt="Alice Smith"
                                                />
                                                <AvatarFallback>AS</AvatarFallback>
                                            </Avatar>
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src="https://api.dicebear.com/9.x/initials/svg?seed=MJ&backgroundType=gradientLinear"
                                                    alt="Michael Johnson"
                                                />
                                                <AvatarFallback>MJ</AvatarFallback>
                                            </Avatar>
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback>
                                                    <User className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Cards with Content */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Card Layouts</CardTitle>
                                        <CardDescription>Flexible containers for any content.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {[
                                                {
                                                    name: 'Design System',
                                                    desc: 'Create tokens and components',
                                                    badge: 'In Progress',
                                                    variant: 'secondary' as const,
                                                },
                                                {
                                                    name: 'API Integration',
                                                    desc: 'Connect backend services',
                                                    badge: 'Complete',
                                                    variant: 'default' as const,
                                                },
                                                {
                                                    name: 'Performance Audit',
                                                    desc: 'Optimize bundle size',
                                                    badge: 'Planned',
                                                    variant: 'outline' as const,
                                                },
                                            ].map((task) => (
                                                <div
                                                    key={task.name}
                                                    className="flex items-center justify-between rounded-lg border p-3"
                                                >
                                                    <div>
                                                        <p className="text-foreground text-sm font-medium">
                                                            {task.name}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">{task.desc}</p>
                                                    </div>
                                                    <Badge variant={task.variant}>{task.badge}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Team Card */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Team Members</CardTitle>
                                        <CardDescription>Combine avatars, text, and badges.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    name: 'Sarah Chen',
                                                    role: 'Lead Designer',
                                                    initials: 'SC',
                                                },
                                                {
                                                    name: 'Marcus Rivera',
                                                    role: 'Full Stack Dev',
                                                    initials: 'MR',
                                                },
                                                {
                                                    name: 'Priya Patel',
                                                    role: 'Product Manager',
                                                    initials: 'PP',
                                                },
                                            ].map((member) => (
                                                <div key={member.name} className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${member.initials}&backgroundType=gradientLinear`}
                                                            alt={member.name}
                                                        />
                                                        <AvatarFallback>{member.initials}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-foreground text-sm font-medium">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">{member.role}</p>
                                                    </div>
                                                    <Badge variant="secondary">Active</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* ── Feedback Tab ── */}
                        <TabsContent value="feedback">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Progress */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Progress</CardTitle>
                                        <CardDescription>Track completion and loading states.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-foreground">Project completion</span>
                                                <span className="text-muted-foreground tabular-nums">
                                                    {progressValue}%
                                                </span>
                                            </div>
                                            <Progress value={progressValue} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                                            >
                                                -10%
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                                            >
                                                +10%
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setProgressValue(100)}>
                                                Complete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Alerts */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Alerts</CardTitle>
                                        <CardDescription>Informational and status messages.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Alert>
                                            <Rocket className="h-4 w-4" />
                                            <AlertTitle>Ready to launch!</AlertTitle>
                                            <AlertDescription>
                                                Your application is configured and ready to deploy.
                                            </AlertDescription>
                                        </Alert>
                                        <Alert variant="destructive">
                                            <AlertTitle>Breaking change</AlertTitle>
                                            <AlertDescription>
                                                Please update your API keys before the next release.
                                            </AlertDescription>
                                        </Alert>
                                    </CardContent>
                                </Card>

                                {/* Tooltips */}
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle className="text-base">Tooltips</CardTitle>
                                        <CardDescription>Contextual information on hover.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                {
                                                    label: 'Edit',
                                                    tip: 'Edit this item',
                                                },
                                                {
                                                    label: 'Share',
                                                    tip: 'Share with your team',
                                                },
                                                {
                                                    label: 'Export',
                                                    tip: 'Download as CSV',
                                                },
                                                {
                                                    label: 'Archive',
                                                    tip: 'Move to archive',
                                                },
                                                {
                                                    label: 'Duplicate',
                                                    tip: 'Create a copy',
                                                },
                                            ].map((item) => (
                                                <Tooltip key={item.label}>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="outline">{item.label}</Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{item.tip}</TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>

                <Separator className="mx-auto max-w-6xl" />

                {/* ── FAQ / Accordion ── */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
                        <div>
                            <Badge variant="outline" className="mb-4">
                                FAQ
                            </Badge>
                            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                                Common questions
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Quick answers to help you get started with this template.
                            </p>
                        </div>
                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                            {faqItems.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger>{item.question}</AccordionTrigger>
                                    <AccordionContent>{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* ── Footer ── */}
                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Terminal className="h-4 w-4" />
                            <span>Laravel v12 + React 19 + Inertia.js + Shadcn UI + Tailwind v4</span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" asChild>
                                <a href="https://laravel.com/docs" target="_blank" rel="noopener noreferrer">
                                    Docs
                                </a>
                            </Button>
                            <Button size="sm" variant="ghost" asChild>
                                <a
                                    href="https://github.com/webminty/laravel-quickstart-inertia"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub
                                </a>
                            </Button>
                        </div>
                    </div>
                </footer>
            </div>
        </TooltipProvider>
    );
}
