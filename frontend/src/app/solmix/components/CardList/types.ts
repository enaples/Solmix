export interface Detector {
    check: string;
    impact: keyof typeof impactToColor;
    description: string;
    first_markdown_element: string;
    markdown: string;
}

export interface DetectorCardProps {
    detector: Detector;
}

export const impactToColor = {
    High: "text-red-500",
    Medium: "text-orange-400",
    Low: "text-yellow-400",
    Informational: "text-blue-400",
    Optimization: "text-green-400",
    Default: "text-white-400"
};

export interface Props {
  data: { detectors: Detector[] };
  toKeep?: string[];
  defaultData: Detector;
}

export const defaultVulDetectionCard: Detector = {
    check: "Vulnerability Detection",
    impact: "Default",
    description: "No vulnerabilities detected.",
    first_markdown_element: "",
    markdown: "",
};

export const defaultOptDetectionCard: Detector = {
    check: "Code Optimization",
    impact: "Default",
    description: "No code optimization to suggest.",
    first_markdown_element: "",
    markdown: "",
};