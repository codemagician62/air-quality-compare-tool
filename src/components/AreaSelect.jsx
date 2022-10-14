import React, { useEffect, useState } from 'react'
import { Select, Button, Header, Table, Rating } from 'semantic-ui-react';
import axios from 'axios';
import dateFormat from "dateformat";
import { baseURL } from '../constant';

export default function AreaSelect({ params }) {
  const [country, setCountry] = useState('US');
  const [city, setCity] = useState('');
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [mesureDataList, setMesureDataList] = useState([]);
  useEffect(() => {
    axios.get(`${baseURL}/v2/countries`).then(countryRes => {
      if (countryRes.status === 200) {
        const countryOptions = countryRes.data.results.map(rec => ({
          key: rec.count,
          value: rec.code,
          text: rec.name
        }));
        setCountryOptions(countryOptions);
      }
    });
  }, []);
  useEffect(() => {
    axios.get(`${baseURL}/v2/cities?sort=asc&country=${country}&order_by=city`)
      .then(res => {
        if (res.status === 200) {
          const cityOptions = res.data.results.map(rec => ({
            key: rec.count,
            value: rec.city,
            text: rec.city
          }));
          setCityOptions(cityOptions);
        }
      });
  }, [country])
  const onChangeCountry = (ev, data) => setCountry(data.value);
  const onChangeCity = (ev, data) => setCity(data.value);
  const onHandleClick = () => {
    console.log("country city ===> ", country, city)
    if (!country || !city) {
      alert("Please select country and city.");
      return;
    }
    axios.get(`${baseURL}/v2/latest?sort=asc&country=${country}&city=${city}&order_by=lastUpdated&dumpRaw=false`)
      .then(res => {
        if (res.status === 200) {
          console.log("mesurement list => ", res.data);
          setMesureDataList(res.data.results);
        }
      });
  }
  return (
    <>
      <Select placeholder='Select your country' options={countryOptions} value={country} onChange={onChangeCountry} />
      <Select placeholder='Select your city' options={cityOptions} value={city} onChange={onChangeCity} />
      <Button content='Show Air Quality' icon={{ color: 'green', name: 'search' }} onClick={onHandleClick} />

      {
        mesureDataList.length > 0 ?
          <Table celled structured>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell rowSpan="2">Location</Table.HeaderCell>
                <Table.HeaderCell rowSpan="2">Coordinates</Table.HeaderCell>
                <Table.HeaderCell colSpan="4">Measurements</Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Air Quality Info</Table.HeaderCell>
                <Table.HeaderCell>Parameter</Table.HeaderCell>
                <Table.HeaderCell>Parameter Description</Table.HeaderCell>
                <Table.HeaderCell>Last Updated</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                mesureDataList.map((data, idx) => {
                  return data.measurements.map((measure, index) => {
                    const param = params.find(p => p.name === measure["parameter"]);
                    return <Table.Row key={idx}>
                      {index === 0 && <Table.Cell rowSpan={index === 0 ? data.measurements.length : 1}>{data.location}</Table.Cell>}
                      {index === 0 && <Table.Cell rowSpan={index === 0 ? data.measurements.length : 1}>[{data.coordinates["latitude"]}, {data.coordinates["latitude"]}]</Table.Cell>}
                      <Table.Cell>{measure["value"]} {measure["unit"]}</Table.Cell>
                      <Table.Cell>{measure["parameter"]}</Table.Cell>
                      <Table.Cell>
                        {param ? param["description"] : "No description"}
                      </Table.Cell>
                      <Table.Cell>{dateFormat(new Date(measure["lastUpdated"]), "mm/dd/yyyy, h:MM:ss TT")}</Table.Cell>
                    </Table.Row>

                  });
                })
              }
            </Table.Body>
          </Table>
          : <p>No measure data to show</p>
      }
    </>
  )
}
