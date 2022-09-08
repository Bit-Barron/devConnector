import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
}: any) => {
  console.log(isAuthenticated, loading);
  return <Component />;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: { auth: any }) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
