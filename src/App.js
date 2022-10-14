import "./App.css";
import AreaSelect from "./components/AreaSelect";
import "semantic-ui-css/semantic.min.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "./constant";
import { Divider, Grid, Segment } from "semantic-ui-react";

function App() {
  const [params, setParams] = useState([]);
  useEffect(() => {
    axios.get(`${baseURL}/v2/parameters`).then((parameterRes) => {
      if (parameterRes.status === 200) {
        setParams(parameterRes.data.results);
      }
    });
  }, []);
  return (
    <Segment>
      <Grid columns={2} relaxed="very">
        <Grid.Column>
          <AreaSelect params={params} />
        </Grid.Column>
        <Grid.Column>
          <AreaSelect params={params} />
        </Grid.Column>
      </Grid>

      <Divider vertical>VS</Divider>
    </Segment>
  );
}

export default App;
