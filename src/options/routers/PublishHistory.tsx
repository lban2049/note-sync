import { useEffect, useRef, useState } from "react"

import { getAllHistory } from "~utils/historyStorage"

export default function Settings() {
  const [historyNotes, setHistoryNotes] = useState<HistoryNotes>(null)

  const initData = async () => {
    const notes = await getAllHistory()
    console.log("notes", notes)
    setHistoryNotes(notes)
  }

  useEffect(() => {
    initData()
  }, [])

  return (
    <div className="pb-2">
      <h1 className="text-2xl">发布历史</h1>
      <div className="mt-5">
        {historyNotes &&
          historyNotes.notes.map((note, index) => {
            return (
              <div className="mb-3" key={index}>
                <div className="text-base text-gray-500 whitespace-pre-wrap border border-gray-600 mt-3 rounded-md p-1">
                  <div>
                    {note.content}
                    <div className="flex mt-2 pt-1 justify-between items-center border-t border-gray-600 px-1">
                      {note.publishDate && (
                        <div className="text-sm text-gray-500">
                          {note.publishDate}
                        </div>
                      )}

                      {note.jikeGroup && (
                        <div className="text-sm text-gray-500 ml-2">
                          {`即刻圈子：${note.jikeGroup}`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
