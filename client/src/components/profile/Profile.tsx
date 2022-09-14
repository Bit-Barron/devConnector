import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';

const Profile = ({
  match,
  getProfileById,
  profile: { profile, loading },
  auth,
}: any) => {
  const { id } = useParams();

  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);
  console.log(match);

  return <>{profile === null || loading ? <Spinner /> : <>profile</>}</>;
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStatetoProps = (state: any) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStatetoProps, { getProfileById })(Profile);
