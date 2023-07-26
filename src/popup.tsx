import './index.css'
import ContentPublish from "~components/ContentPublish";

function IndexPopup() {
  return (
    <div
      className="p-5 overflow-auto"
      style={{
        width: "700px",
        height: "600px",
      }}
    >
      <ContentPublish />
    </div>
  )
}

export default IndexPopup
