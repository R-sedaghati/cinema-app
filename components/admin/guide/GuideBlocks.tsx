import type { GuideBlock } from "@/lib/constants/guide/content";
import { AlertTriangle, Info } from "lucide-react";

const GuideBlocks = ({ blocks }: { blocks: GuideBlock[] }) => (
  <div className="flex flex-col gap-4">
    {blocks.map((block, index) => {
      switch (block.kind) {
        case "h":
          return (
            <p key={index} className="font-h4-bold mt-2 text-error-500">
              {block.text}
            </p>
          );

        case "p":
          return (
            <p key={index} className="text-sm leading-7 text-gray-700">
              {block.text}
            </p>
          );

        case "list":
          return (
            <ul
              key={index}
              className="list-disc pr-6 text-sm leading-7 text-gray-700"
            >
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );

        case "steps":
          return (
            <ol
              key={index}
              className="list-decimal pr-6 text-sm leading-7 text-gray-700"
            >
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );

        case "table":
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full min-w-md border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    {block.head.map((cell, i) => (
                      <th
                        key={i}
                        className="border border-gray-200 px-3 py-2 text-right font-semibold text-gray-800"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="border border-gray-200 px-3 py-2 leading-6 text-gray-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case "note":
          return (
            <div
              key={index}
              className="flex gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3"
            >
              <Info size={18} className="mt-0.5 shrink-0 text-gray-500" />
              <p className="text-sm leading-7 text-gray-700">{block.text}</p>
            </div>
          );

        case "warn":
          return (
            <div
              key={index}
              className="flex gap-2 rounded-xl border border-error-500 bg-error-50 p-3"
            >
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-error-500"
              />
              <p className="text-sm leading-7 text-error-700">{block.text}</p>
            </div>
          );
      }
    })}
  </div>
);

export default GuideBlocks;
