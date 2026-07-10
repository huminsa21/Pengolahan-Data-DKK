type SectionHeadingProps = {
    eyebrow?: string;
    title: string;
    description?: string;
};

export function SectionHeading({
    eyebrow,
    title,
    description,
}: SectionHeadingProps) {
    return (
        <div className="max-w-3xl">
            {eyebrow && (
                <p className="text-sm font-semibold tracking-wide text-emerald-700 uppercase">
                    {eyebrow}
                </p>
            )}
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">
                {title}
            </h2>
            {description && (
                <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                </p>
            )}
        </div>
    );
}
