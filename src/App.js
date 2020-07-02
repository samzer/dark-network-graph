import React from "react";
import "./App.css";
import Highcharts from "highcharts";
import HighchartNetwork from "highcharts/modules/networkgraph";
import HighchartsReact from "highcharts-react-official";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import HomeIcon from "@material-ui/icons/Home";
import GitHubIcon from "@material-ui/icons/GitHub";
import { Link } from "@material-ui/core";

import darkImage from "./dark.jpg";

import { graphData, characterUrl } from "./data";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "80%",
    height: "80%",
  },
}));

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = React.useState();

  const options = {
    chart: {
      type: "networkgraph",
      height: "100%",
      backgroundColor: "transparent",
    },
    title: {
      text: "An interactive web of the family tree",
      style: { color: "white" },
    },

    plotOptions: {
      networkgraph: {
        keys: ["from", "to"],
        layoutAlgorithm: {
          enableSimulation: true,
          friction: -0.9,
        },
        events: {
          click: function (event) {
            handleOpen(event.point.name);
          },
        },
      },
    },
    series: [
      {
        dataLabels: {
          enabled: true,
          linkFormat: "",
          color: "white",
        },
        id: "lang-tree",
        data: graphData,
      },
    ],
    credits: false,
  };

  const handleOpen = (character) => {
    setUrl(characterUrl[character]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  HighchartNetwork(Highcharts);

  Highcharts.addEvent(Highcharts.Series, "afterSetOptions", function (e) {
    var colors = Highcharts.getOptions().colors,
      nodes = {};

    const parseNode = (node) => {
      let color = colors[0];

      if (node.includes("Tiedemen")) {
        color = colors[6];
      } else if (node.includes("Tauber")) {
        color = colors[2];
      } else if (node.includes("Nielsen")) {
        color = colors[3];
      } else if (node.includes("Kahnwald")) {
        color = colors[4];
      } else if (node.includes("Doppler")) {
        color = colors[5];
      }
      return {
        id: node,
        marker: {
          radius: 10,
        },
        color: color,
      };
    };

    if (
      this instanceof Highcharts.seriesTypes.networkgraph &&
      e.options.id === "lang-tree"
    ) {
      e.options.data.forEach(function (link) {
        if (
          nodes[link[0]] &&
          nodes[link[0]].color &&
          nodes[link[1]] &&
          nodes[link[1]].color
        ) {
          return;
        } else if (nodes[link[1]] && nodes[link[1]].color) {
          nodes[link[0]] = parseNode(link[0]);
        } else if (nodes[link[0]] && nodes[link[0]].color) {
          nodes[link[1]] = parseNode(link[1]);
        } else {
          nodes[link[0]] = parseNode(link[0]);
          nodes[link[1]] = parseNode(link[1]);
        }
      });

      e.options.nodes = Object.keys(nodes).map(function (id) {
        return nodes[id];
      });
    }
  });

  return (
    <div className="App">
      <header>
        <img src={darkImage} class="Header-image" alt="Dark" />
        <div>
          <Link href="https://www.saitama.solutions">
            <HomeIcon style={{ color: "white", margin: 20, fontSize: 30 }} />
          </Link>
          <Link
            href="https://github.com/saitama-solutions/dark-series-character-network"
            target="_"
          >
            <GitHubIcon style={{ color: "white", margin: 20, fontSize: 30 }} />
          </Link>
        </div>
      </header>
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <iframe
                src={url}
                title="description"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </Fade>
        </Modal>
      </div>
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          allowChartUpdate={false}
        />
      </div>
    </div>
  );
}

export default App;
