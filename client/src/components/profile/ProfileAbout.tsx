import React from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    skill,
    index,
    user: { name },
  },
}: any) => {
  return (
    <div className='profile-about bg-light p-2'>
      {bio && (
        <>
          <h2 className='text-primary'>{name.trim().split(' ')[0]}s Bio</h2>
          <p>{bio}</p>
        </>
      )}

      <div className='line'></div>
      <h2 className='text-primary'>Skill Set</h2>
      {skills.map((skill: any, index: any) => (
        <div className='p-1' key={index}>
          <i className='fas fa-check' /> {skill}
        </div>
      ))}
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
