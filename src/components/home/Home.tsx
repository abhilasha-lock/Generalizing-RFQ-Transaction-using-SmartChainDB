import {
  Fab,
  Grid,
  Icon,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
const { Connection } = require("stardog");
import { query } from "stardog";
import withStyles from '@material-ui/core/styles/withStyles';
import {
  flatMap as _flatMap,
  get as _get,
  kebabCase as _kebabCase,
  snakeCase as _snakeCase
} from 'lodash-es';
import React, { Component } from 'react';
import ContentLoader from 'react-content-loader';
import { from } from 'rxjs';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
import { callbackify } from 'util';
import { promised } from 'q';




const conn = new Connection({
  username: "admin",
  password: "admin",
  endpoint: "http://localhost:5820"
});
const dbName = 'RequestDB'



const styles = (theme: any) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  grid: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  contentLoader: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  btnContainer: {
    display: 'flex',
    flex: 1
  },
  btnFiller: {
    'flex-grow': 1
  },
  submitBtn: {
    'align-self': 'flex-end'
  }
});

type HomeProps = {
  classes: { [className: string]: string | undefined };
};

type RFxForm = {
  [field: string]: string | number;
};



type HomeState = {
  formFields: string[];
  validFormValues: {
    string?: string[];
  };
  loadingForm: boolean;
  form: RFxForm;
  displayFields: boolean;
  queryFormFields: string[];

};



const query_req = `PREFIX rm: <http://resourcedescription.tut.fi/ontology/resourceModel#>
PREFIX re: <http://www.co-ode.org/ontologies/ont.owl#>
SELECT ?s {
   ?s rdfs:subClassOf re:Request
}
`;


// const options: string[] = [];

class Home extends Component<HomeProps, HomeState> {
  state = {
    formFields: [],
    validFormValues: {},
    loadingForm: false,
    displayFields: false,
    queryFormFields: [],
    form: {},
    options: []
  };



  componentDidMount() {
    // Load data

    this.getFields = this.getFields.bind(this);
    this.getFormFields(query_req);
    // from(this.getFormFields(query_req))
    //   .pipe(
    //     tap(fields => this.setState({ formFields: fields })),
    //     switchMap(fields =>
    //       _flatMap(fields, field =>
    //         from(this.getAllowedValues(field)).pipe(
    //           map(promise => ({ field, value: promise }))
    //         )
    //       )
    //     ),
    //     concatMap(observable => observable)
    //   )
    //   .subscribe(
    //     values => {
    //       this.setState({ loadingForm: false });
    //       this.setState({
    //         validFormValues: {
    //           ...this.state.validFormValues,
    //           [_kebabCase(values.field)]: values.value
    //         }
    //       });
    //     },
    //     err => {
    //       this.setState({
    //         loadingForm: false,
    //         formFields: [],
    //         validFormValues: {}
    //       });
    //       console.log('Unable to load form fields', err);
    //     }
    //   );


  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.layout} >
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Request for Quote
          </Typography>

          {this.state.loadingForm && (
            <ContentLoader className={classes.contentLoader} />
          )}
          {!this.state.loadingForm && (
            <div>
              < Dropdown
                options={this.state.options}
                placeholder={this.state.validFormValues.option}
                onChange={this.getFields.bind(this)}
              />
              {console.log(this.state.formFields)}
              {
                this.state.formFields.map(field => (
                  < Grid item xs={12} sm={6} key={_kebabCase(field)} >
                    <TextField
                      id={_kebabCase(field)}
                      name={_kebabCase(field)}
                      label={field}
                      onChange={e => this.onFormFieldUpdated(field, e)}
                    />
                  </Grid>
                ))}

              <div className={classes.btnContainer}>
                <div className={classes.btnFiller} />
                <Fab
                  size={'small'}
                  color={'primary'}
                  onClick={() => this.submitForm()}
                >
                  <Icon>send</Icon>
                </Fab>
              </div>
            </div>
          )}
        </Paper>
      </main >
    );
  }

  async getFields(props: any) {
    console.log(props.value);
    console.log(props);

    const query_RFx = `PREFIX rm: <http://resourcedescription.tut.fi/ontology/resourceModel#>
                      PREFIX re: <http://www.co-ode.org/ontologies/ont.owl#>
 
                      SELECT ?s ?g WHERE {
                        ?s a owl:DatatypeProperty .
                        { ?s rdfs:domain re:` + props.value + ` } UNION {?s rdfs:domain re:Request }  .
                          ?s rdfs:label ?g
                        }
                      `;

    console.log(query_RFx);
    query.execute(conn, dbName, query_RFx).then(res => {
      if (!res.ok) {

        throw new Error(
          `Something went wrong. Received response: ${res.status} ${res.statusText}`
        );
        return;
      }

      let set = new Set<string>()
      console.log("Query results");
      console.log(res.body);
      console.log(res.body.results.bindings);
      console.log(res.body.results.bindings.length);
      for (var i = 0; i < res.body.results.bindings.length; ++i) {
        set.add(res.body.results.bindings[i].g.value);
      }

      let data: string[] = Array.from(set.values());

      this.setState({
        displayFields: true,
        formFields: data,
        validFormValues: {
          ...this.state.validFormValues,
          [_kebabCase("option")]: props.value
        },
        form: {
          ...this.state.form,
          [_kebabCase("option")]: props.value
        },
      });

      // console.log(data);
      // console.log(this.state.formFields)

    });



  }

  submitForm() {
    this.sendRequestForQuote(this.state.form);
  }

  onFormFieldUpdated(field: string, event: React.ChangeEvent<HTMLElement>) {

    this.setState({
      form: {
        ...this.state.form,
        [_snakeCase(field)]: _get(event, 'target.value')
      },
      validFormValues: {
        ...this.state.validFormValues,
        [_snakeCase(field)]: _get(event, 'target.value')
      }
    });

    console.log(this.state.form);

  }
  //make call to the form in setState

  private async getFormFields(readQuery) {
    this.setState({ loadingForm: true });

    query.execute(conn, dbName, readQuery).then(res => {
      if (!res.ok) {
        this.setState({
          loadingForm: false
        });
        throw new Error(
          `Something went wrong. Received response: ${res.status} ${res.statusText}`
        );
        return;
      }
      console.log(res.body.results.bindings[0].s.value);
      // res.body.results = res.body.results.map(field => field.s.value);
      this.setState({ loadingForm: false });
      let res1 = [];
      for (var field in res.body.results.bindings) {

        res1.push(res.body.results.bindings[field].s.value.split('#')[1]);
      }

      for (var field in res1) { this.state.options.push(res1[field]); }
      console.log(this.state.options);
      console.log(res1);
      // this.setState({ formFields: res1 });
      return res.body.results;
    });

    return;
  }

  private async getAllowedValues(field: string) {
    this.setState({ loadingForm: true });
    // const response = await fetch('http://localhost:8080/rfq/form/fields');
    // if (response.status >= 500) {
    //   console.log('Failed to fetch form fields');
    //   return [];
    // }
    query.execute(conn, dbName, query_RFx).then(res => {
      if (!res.ok) {
        this.setState({
          loadingForm: false
        });
        throw new Error(
          `Something went wrong. Received response: ${res.status} ${res.statusText}`
        );
        return;
      }
      // res.body.results = res.body.results.map(field => field.s.value);
      this.setState({ loadingForm: false });
      let res1 = [];
      for (var field in res.body.results.bindings) {

        res1.push(res.body.results.bindings[field].s.value.split('#')[1]);
      }

      console.log(res1);
      this.setState({ formFields: res1 });
      return res.body.results;
    });

    return;
  }
}
export default withStyles(styles)(Home);


//have redux for api callbackify
//create fnx to make api callbackify

//fetch API promised.den
//set a 

//set state with nrew data

//re rendering under callback 


