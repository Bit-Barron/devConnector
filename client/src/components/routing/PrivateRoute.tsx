import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}: any) => {
  console.log(isAuthenticated, loading);
  return (
    <div>
      test
      <Component />
    </div>
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: { auth: any }) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute) as any;
