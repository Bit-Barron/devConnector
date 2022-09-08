import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute: typeof Route & { propTypes: any } = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}: any) => (
  <Route
    {...rest}
    render={(props: JSX.IntrinsicAttributes) =>
      !isAuthenticated && !loading ? (
        <Navigate to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: { auth: any }) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
