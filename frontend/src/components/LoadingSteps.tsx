import { useState, useEffect, useRef } from 'react'
import { AudioLines, FileText, Sparkles, Wand2 } from 'lucide-react'

interface LoadingStepsProps {
    isExtractingAudio: boolean
    compact?: boolean
}

export function LoadingSteps({ isExtractingAudio, compact = false }: LoadingStepsProps) {
    const [step, setStep] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const activeStepRef = useRef<HTMLDivElement>(null)

    const steps = isExtractingAudio
        ? [
            { label: 'Extracting audio from lecture...', icon: AudioLines },
            { label: 'Transcribing lecture content...', icon: FileText },
            { label: 'Analyzing speaker segments...', icon: Sparkles },
            { label: 'Identifying key themes...', icon: Wand2 },
            { label: 'Using AI to generate summary...', icon: Sparkles },
            { label: 'Finalizing timestamps...', icon: Wand2 }
        ]
        : [
            { label: 'Accessing Panopto captions...', icon: FileText },
            { label: 'Filtering noise and breaks...', icon: Sparkles },
            { label: 'Using AI to generate summary...', icon: Sparkles },
            { label: 'Refining topic transitions...', icon: Wand2 },
            { label: 'Finalizing timestamps...', icon: Wand2 }
        ]

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s < steps.length - 1 ? s + 1 : s))
        }, 1500)
        return () => clearInterval(interval)
    }, [steps.length])

    useEffect(() => {
        if (activeStepRef.current && containerRef.current) {
            const container = containerRef.current
            const activeItem = activeStepRef.current

            const itemOffsetTop = activeItem.offsetTop
            const containerHeight = container.clientHeight
            const itemHeight = activeItem.offsetHeight

            const scrollPos = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2)

            container.scrollTo({
                top: Math.max(0, scrollPos),
                behavior: 'smooth'
            })
        }
    }, [step])

    if (compact) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full h-full">
                <div
                    ref={containerRef}
                    className="space-y-2 max-h-[150px] overflow-y-auto pr-1 w-full max-w-[280px] custom-scrollbar mask-fade"
                >
                    {steps.map((s, i) => {
                        const Icon = s.icon
                        const isActive = i === step
                        const isCompleted = i < step

                        return (
                            <div
                                key={i}
                                ref={isActive ? activeStepRef : null}
                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all duration-500 ${isActive
                                        ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]'
                                        : 'border-transparent opacity-40'
                                    } ${isCompleted ? 'opacity-20 grayscale' : ''}`}
                            >
                                <div className={`p-1.5 rounded-md shrink-0 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {s.label}
                                </span>
                                {isActive && (
                                    <div className="ml-auto flex gap-1 shrink-0">
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="space-y-3 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar mask-fade w-full"
        >
            {steps.map((s, i) => {
                const Icon = s.icon
                const isActive = i === step
                const isCompleted = i < step

                return (
                    <div
                        key={i}
                        ref={isActive ? activeStepRef : null}
                        className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-500 ${isActive
                                ? 'border-primary bg-primary/5 shadow-sm scale-[1.02]'
                                : 'border-transparent opacity-40'
                            } ${isCompleted ? 'opacity-20 grayscale' : ''}`}
                    >
                        <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {s.label}
                        </span>
                        {isActive && (
                            <div className="ml-auto flex gap-1 shrink-0">
                                <span className="w-1 h-1 bg-primary rounded-full animate-bounce"></span>
                                <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
