import { useGetFoodsQuery } from "./foodsApiSlice"
import Food from "./Food"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const FoodsList = () => {

  const navigate = useNavigate()

  const [filteredContainers, setFilteredContainers] = useState([])
  const [filteredDate, setFilteredDate] = useState([{expired: true, day: 15}])

  let uniqueContainers = []

  const onFilteredContainersChanged = (e) => {
    if (e.target.checked) {
      setFilteredContainers(filteredContainers => [...filteredContainers, e.target.value])
    } else {
      setFilteredContainers(filteredContainers => filteredContainers.filter(container => container !== e.target.value))
    }
  }
  const onFilteredDateChanged = (e) => {
    if (e.target.checked) {
      setFilteredDate(filteredDate => [...filteredDate, e.target.value])
    } else {
      setFilteredDate(filteredDate => filteredDate.filter(container => container !== e.target.value))
    }
    console.log(filteredDate);
  }

  const {
    data: foods,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetFoodsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <p>Loading...</p>
  if (isError) content = <p>{error?.data?.messge}</p>

  useEffect(() => {
    if (isSuccess) {
      setFilteredContainers(uniqueContainers)
    }
  }, [isSuccess])

  if (isSuccess) {
    const { ids, entities } = foods
    console.log(entities);
    // Get Unique Containers
    const tempContainers = new Set()
    for (var key in entities) {
      tempContainers.add(entities[key].container)
    }
    uniqueContainers = [...tempContainers]

    const filteredContainersIds = ids.filter(id => filteredContainers.includes(entities[id].container))
    const filteredIds = filteredContainersIds


    const tableContent = filteredIds?.length
      ? filteredIds.map(foodId => <Food key={foodId} foodId={foodId} />)
      : null

    content = (
      <div className="relative min-h-lvh px-8">
        <div className="text-3xl font-bold text-base-content mx-auto">
          <button onClick={() => navigate('/dash/foodLists')}>My Foods</button>
        </div>

        <div className="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4">
          <div>

            <div className="dropdown dropdown-hover  text-sm px-4">
              <button tabIndex={0} className="inline-flex items-center">
                Expiration
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              <ul tabIndex={0} className="dropdown-content bg-base-200 z-[1] menu md:p-2 shadow rounded-box w-52">
                <input type="range" min={0} max="15" value="5" step={1} className="range range-sm range-primary" />
                <div className="text-xs pt-1 mb-4">
                  <span class="absolute start-0 ml-1">0</span>
                  <span class="absolute start-1/3 -translate-x-1/2 ml-1">5</span>
                  <span class="absolute start-2/3 -translate-x-1/2 ml-1">10</span>
                  <span class="absolute end-0 ">&gt;14</span>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text ">Show Expired</span>
                    <input type="checkbox" defaultChecked className="checkbox checkbox-primary" value={0} onChange={onFilteredDateChanged} />
                  </label>
                </div>
              </ul>
            </div>
            <div className="dropdown dropdown-hover text-base-neutral-content/10 text-sm px-4">
              <button tabIndex={0} className="inline-flex items-center">
                Container
                <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              <ul tabIndex={0} className="dropdown-content z-[1] menu md:p-2 shadow bg-base-200 rounded-box w-52">
                {uniqueContainers.map(container => {
                  return (
                    <div className="form-control" key={container}>
                      <label className="label cursor-pointer">
                        <span className="label-text"> {container} </span>
                        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" defaultChecked value={container} onChange={onFilteredContainersChanged} />
                      </label>
                    </div>
                  )
                })}
              </ul>
            </div>

            <button
              className="btn btn-sm btn-outline btn-secondary"
              type="button"
              onClick={() => navigate('/dash/foodLists/new')}
            >
              <span className="sr-only">Add New Food</span>
              Add Food
            </button>
          </div>
        </div>

        <div className="relative overflow-x-auto rounded-lg">
          <table className="table table-xs table-fixed lg:table-sm">
            <thead>
              <tr>
                <th className="w-1/12">
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th className="w-1/4">Name</th>
                <th className="w-1/4">Days Until Expiration</th>
                <th>Quantity</th>
                <th className="w-">Container</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tableContent}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Days Until Expiration</th>
                <th>Quantity</th>
                <th>Container</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }


  return content
}

export default FoodsList