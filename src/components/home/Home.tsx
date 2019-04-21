import {
  Fab,
  Grid,
  Icon,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
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

type RFQForm = {
  [field: string]: string | number;
};

type HomeState = {
  formFields: string[];
  validFormValues: {
    string?: string[];
  };
  loadingForm: boolean;
  form: RFQForm;
};

class Home extends Component<HomeProps, HomeState> {
  state = { formFields: [], validFormValues: {}, loadingForm: false, form: {} };

  componentDidMount() {
    // Load data
    from(this.getFormFields())
      .pipe(
        tap(fields => this.setState({ formFields: fields })),
        switchMap(fields =>
          _flatMap(fields, field =>
            from(this.getAllowedValues(field)).pipe(
              map(promise => ({ field, value: promise }))
            )
          )
        ),
        concatMap(observable => observable)
      )
      .subscribe(
        values => {
          this.setState({ loadingForm: false });
          this.setState({
            validFormValues: {
              ...this.state.validFormValues,
              [_kebabCase(values.field)]: values.value
            }
          });
        },
        err => {
          this.setState({
            loadingForm: false,
            formFields: [],
            validFormValues: {}
          });
          console.log('Unable to load form fields', err);
        }
      );
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Request for Quote
          </Typography>
          {this.state.loadingForm && (
            <ContentLoader className={classes.contentLoader} />
          )}
          {!this.state.loadingForm && (
            <div>
              <Grid container spacing={24} className={classes.grid}>
                {this.state.formFields.map(field => (
                  <Grid item xs={12} sm={6} key={_kebabCase(field)}>
                    <TextField
                      id={_kebabCase(field)}
                      name={_kebabCase(field)}
                      label={field}
                      onChange={e => this.onFormFieldUpdated(field, e)}
                    />
                  </Grid>
                ))}
              </Grid>
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
      </main>
    );
  }

  submitForm() {
    this.sendRequestForQuote(this.state.form);
  }

  onFormFieldUpdated(field: string, event: React.ChangeEvent<HTMLElement>) {
    this.setState({
      form: {
        ...this.state.form,
        [_snakeCase(field)]: _get(event, 'target.value')
      }
    });
  }

  private async getFormFields(): Promise<string[]> {
    this.setState({ loadingForm: true });
    const response = await fetch('http://localhost:8080/rfq/form/fields');
    if (response.status >= 500) {
      console.log('Failed to fetch form fields');
      return [];
    }
    return response.json();
  }

  private async getAllowedValues(field: string): Promise<string[]> {
    this.setState({ loadingForm: true });
    const response = await fetch(
      `http://localhost:8080/rfq/form/values?field=${field}`
    );
    if (response.status >= 500) {
      console.log(`Failed to fetch allowed values for field=${field}`);
      return [];
    }
    return response.json();
  }

  private async sendRequestForQuote(form: RFQForm): Promise<number> {
    const response = await fetch('http://localhost:8080/rfq', {
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    });
    return response.status;
  }
}

export default withStyles(styles)(Home);
