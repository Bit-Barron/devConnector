import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import ProfileExperience from './ProfileExperience';
import { getProfileById } from '../../actions/profile';
import Experience from '../dashboard/Experience';

const Profile = ({
  getProfileById,
  profile: { profile, loading },
  auth,
}: any) => {
  const { id } = useParams();

  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);

  return (
    <>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <>
          <Link to='/profiles' className='btn btn-light'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primar'>Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((experience: any) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    ></ProfileExperience>
                  ))}
                </>
              ) : (
                <h4>No experience Credentials</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primar'>Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((education: any) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    ></ProfileEducation>
                  ))}
                </>
              ) : (
                <h4>No experience Credentials</h4>
              )}
            </div>
            {profile.githubusername && (
                <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      )}
    </>
  );
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
