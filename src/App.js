import { React, useEffect, useState } from "react";
import "./styles.css"
import { fetchUserData } from "./Api";

const SortDirection = {
  DEFAULT: 0,
  ASC: 1,
  DESC: 2
};

function flattenData(data) {
  return data.map((person) => {
    return {
      uuid: person.login.uuid,
      name: person.name.first,
      lastName: person.name.last,
      streetName: person.location.street.name,
      streetNumber: person.location.street.number,
      city: person.location.city,
      country: person.location.country
    };
  });
}

export default function App() {
  const [state, setState] = useState({
    data: [],
    filteredData: [],
    sortBy: "name",
    sortDirection: SortDirection.DEFAULT
  });

  useEffect(() => {
    fetchUserData().then((apiData) => {
      const data = flattenData(apiData);
      setState((s) => {
        return { ...s, data: data, filteredData: data };
      });
    });
  }, []);

  const handleOnClick = (event) => {
    event.preventDefault();
    const columnName = event.target.innerText;
    const sortName = getSortBy(columnName);
    const newSortDirection = getSortDirection(state.sortDirection);
    setState((s) => {
      return {
        ...s,
        sortBy: sortName,
        sortDirection: newSortDirection
      };
    });

    const sortedData = sortData(newSortDirection);
    setState((s) => {
      return {
        ...s,
        data: sortedData,
        filteredData: sortedData
      };
    });
  };

  const getSortDirection = (sortDirection) =>
    sortDirection === SortDirection.ASC
      ? SortDirection.DESC
      : SortDirection.ASC;

  const sortData = (sortDirection) => {
    const newData = state.filteredData.slice();
    newData.sort((a, b) => {
      const propA = a[state.sortBy];
      const propB = b[state.sortBy];
      var res;
      if (propA > propB) res = 1;
      else if (propA < propB) res = -1;
      else res = 0;

      return (
        sortDirection === SortDirection.DESC
      ) ? res * -1 : res;
    });
    return newData;
  };

  const getSortBy = (columnName) => {
    var propName = "";
    switch (columnName) {
      case "Name":
        propName = "name";
        break;
      case "Lastname":
        propName = "lastName";
        break;
      case "Street":
        propName = "streetName";
        break;
      case "Number":
        propName = "streetNumber";
        break;
      case "City":
        propName = "city";
        break;
      case "Country":
        propName = "country";
        break;
      default:
        propName = "name";
    }
    return propName;
  };

  const handleChange = (e) => {
    const query = e.target.value;

    if (query === "") {
      setState((s) => {
        return {
          ...s,
          filteredData: s.data
        };
      });
    } else {
      const newData = state.data.slice(0).filter((p) => {
        return p.name
          .concat(p.lastName)
          .concat(p.streetName)
          .concat(p.streetNumber)
          .concat(p.city)
          .concat(p.country)
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase());
      });
      setState((s) => {
        return {
          ...s,
          filteredData: newData
        };
      });
    }
  };

  return (
    <div className="App">
      <h1>Hello UserList</h1>
      <label>Search: <input id="query" type="text" onChange={handleChange} /></label>
      <table>
        <thead>
          <tr>
            <th onClick={handleOnClick}>Name</th>
            <th onClick={handleOnClick}>Lastname</th>
            <th onClick={handleOnClick}>Street</th>
            <th onClick={handleOnClick}>Number</th>
            <th onClick={handleOnClick}>City</th>
            <th onClick={handleOnClick}>Country</th>
          </tr>
        </thead>
        <tbody>
          {state.filteredData.map((person) => (
            <tr key={person.uuid}>
              <td>{person.name}</td>
              <td>{person.lastName}</td>
              <td>{person.streetName}</td>
              <td>{person.streetNumber}</td>
              <td>{person.city}</td>
              <td>{person.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
