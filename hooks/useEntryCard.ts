import { useRouter } from "next/router";
import { useContext } from "react";
import { UIContext } from "../context/ui";
import { Entry } from "../interfaces";

interface Props{
    entry: Entry
}

const useEntryCard = ({entry}:Props) => {
    const { startDragging, endDragging } = useContext(UIContext);
    const router = useRouter()
    const onDragStart = (event: DragEvent) => {
        event.dataTransfer?.setData("text", entry._id);
        startDragging();
      };
    
      const onDragEnd = (event: DragEvent) => {
        endDragging();
      };
      const onClickEntry = () => {
        router.push(`/entries/${entry._id}`)
      }
    return {
        onDragStart,
        onDragEnd,
        onClickEntry
    }
}