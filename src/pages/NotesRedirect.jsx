import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const NotesRedirect = () => {
    const { subjectSlug, topicSlug } = useParams();

    if (subjectSlug && topicSlug) {
        return <Navigate to={`/subjects/${subjectSlug}/${topicSlug}`} replace />;
    }

    if (subjectSlug) {
        return <Navigate to={`/subjects/${subjectSlug}`} replace />;
    }

    return <Navigate to="/subjects" replace />;
};

export default NotesRedirect;
