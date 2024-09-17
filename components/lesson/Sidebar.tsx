import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Layers, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

interface SidebarProps {
  title: string
  subtitle: string
  onSectionClick: (section: string) => void
}

export function Sidebar({ title, subtitle, onSectionClick }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const contents = [
    { title: "Introduction", id: "introduction" },
    { title: "Video Lesson", id: "video" },
    { title: "Main Content", id: "main-content" },
    { title: "Activity", id: "activity" },
    { title: "Summary", id: "summary" },
  ]

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const handleKeyDown = (event: React.KeyboardEvent, index: number, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      setActiveIndex(index)
      onSectionClick(id)
    }
  }

  return (
    <div className="w-full space-y-6 bg-gray-50 dark:bg-card p-6 rounded-xl shadow-lg">
      <Card className="overflow-hidden border-none shadow-md">
        <CardContent className="p-6 bg-gradient-to-br from-purple-500 to-blue-500">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 bg-white p-2 rounded-lg">
              <Layers className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-purple-100"><ReactMarkdown>{subtitle}</ReactMarkdown></p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <button
          onClick={toggleExpand}
          className="flex justify-between items-center w-full text-xl font-semibold dark:text-white text-gray-800 hover:text-purple-600 transition-colors"
        >
          Contents
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
        {isExpanded && (
          <ul className="space-y-2 transition-all duration-300 ease-in-out">
            {contents.map((item, index) => (
              <li key={index}>
                <Link
                  href={`#${item.id}`}
                  onClick={() => {
                    setActiveIndex(index)
                    onSectionClick(item.id)
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, item.id)}
                  className={`block p-2 rounded-lg transition-colors ${
                    index === activeIndex
                      ? "bg-purple-100 text-purple-800 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 dark:text-white dark:bg-card"
                  } cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                  tabIndex={0}
                  role="button"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg rounded-xl transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
        <Sparkles className="w-5 h-5 mr-2" />
        Start Quiz {" "} <span className="ml-1 text-[12px] text-purple-200">+40pts</span>
      </Button>
    </div>
  )
}