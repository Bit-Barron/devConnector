import React from 'react';
import PropTypes from 'prop-types';
import { Route, Navigate, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import auth from '../../reducers/auth';

const PrivateRoute = ({ component: Component, auth: {isAuthenticated, loading}, ...rest }: any) => (
    // @ts-ignore
  <Route {...rest} render={(props: any) => !isAuthenticated && !loading ? (<Navigate to="/login" />) : (<Component {...props} />)} />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
