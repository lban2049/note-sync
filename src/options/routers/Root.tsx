import { NavLink, Outlet } from "react-router-dom"

export default function Root() {

  const getItemCss = ({isActive, isPending}) => {
    let css = 'text-gray-500';
    if (isActive) {
      css = 'text-ar-600 font-bold'
    }

    // css += ' cursor-pointer';
    return css;
  }
  return (
    <div className="p-5 max-w-5xl m-auto">
      <div className="flex">
        <div style={{
          width: 300,
        }} className="shrink-0">
          <h1 className="text-3xl">Options</h1>
          <nav className="mt-5">
            <ul className="text-base">
              <li>
                <NavLink className={getItemCss} to="/">内容发布</NavLink>
              </li>
              <li className={`mt-3`}>
                <NavLink className={getItemCss} to="/setting">配置</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex-1 pt-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
