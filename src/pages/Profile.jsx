import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaWeibo, FaEdit } from 'react-icons/fa';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import ImageUpload from '../components/profile/ImageUpload';
import EducationSection from '../components/profile/EducationSection';
import WorkSection from '../components/profile/WorkSection';
import AchievementSection from '../components/profile/AchievementSection';
import SkillsSection from '../components/profile/SkillsSection';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('获取个人资料失败');
            }

            const data = await response.json();
            setProfile(data.profile);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (updatedData) => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('更新个人资料失败');
            }

            const data = await response.json();
            setProfile(data.profile);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchProfile}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            {/* 封面图片 */}
            <div className="relative h-64 mb-20 rounded-xl overflow-hidden">
                <img
                    src={profile?.coverImage?.url || '/default-cover.jpg'}
                    alt="个人封面"
                    className="w-full h-full object-cover"
                />
                <ImageUpload
                    type="cover"
                    onUploadSuccess={(imageData) => {
                        setProfile(prev => ({
                            ...prev,
                            coverImage: imageData
                        }));
                    }}
                />
                
                {/* 头像 */}
                <div className="absolute -bottom-16 left-8">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                        <img
                            src={profile?.avatar?.url || '/default-avatar.jpg'}
                            alt="头像"
                            className="w-full h-full object-cover"
                        />
                        <ImageUpload
                            type="avatar"
                            onUploadSuccess={(imageData) => {
                                setProfile(prev => ({
                                    ...prev,
                                    avatar: imageData
                                }));
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 个人信息 */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {profile?.nickname || profile?.user?.username}
                        </h1>
                        <p className="text-gray-600 mt-2">{profile?.bio}</p>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        <FaEdit className="mr-2" />
                        {isEditing ? '取消编辑' : '编辑资料'}
                    </button>
                </div>

                {isEditing ? (
                    <ProfileEditForm
                        profile={profile}
                        onSubmit={handleProfileUpdate}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <>
                        {/* 基本信息 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">基本信息</h3>
                                <div className="space-y-3">
                                    <p className="flex items-center text-gray-600">
                                        <span className="font-medium mr-2">位置：</span>
                                        {profile?.location || '未设置'}
                                    </p>
                                    <p className="flex items-center text-gray-600">
                                        <span className="font-medium mr-2">网站：</span>
                                        {profile?.website ? (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                {profile.website}
                                            </a>
                                        ) : '未设置'}
                                    </p>
                                </div>
                            </div>

                            {/* 社交链接 */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">社交链接</h3>
                                <div className="flex space-x-4">
                                    {profile?.social?.github && (
                                        <a
                                            href={profile.social.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <FaGithub size={24} />
                                        </a>
                                    )}
                                    {profile?.social?.twitter && (
                                        <a
                                            href={profile.social.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-400"
                                        >
                                            <FaTwitter size={24} />
                                        </a>
                                    )}
                                    {profile?.social?.linkedin && (
                                        <a
                                            href={profile.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-700"
                                        >
                                            <FaLinkedin size={24} />
                                        </a>
                                    )}
                                    {profile?.social?.weibo && (
                                        <a
                                            href={profile.social.weibo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-red-500"
                                        >
                                            <FaWeibo size={24} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 技能和兴趣 */}
                        <SkillsSection
                            skills={profile?.skills || []}
                            interests={profile?.interests || []}
                            onUpdate={(updatedData) => handleProfileUpdate({ ...profile, ...updatedData })}
                        />
                    </>
                )}
            </div>

            {/* 教育经历 */}
            <EducationSection
                education={profile?.education || []}
                onUpdate={(education) => handleProfileUpdate({ ...profile, education })}
            />

            {/* 工作经历 */}
            <WorkSection
                work={profile?.work || []}
                onUpdate={(work) => handleProfileUpdate({ ...profile, work })}
            />

            {/* 成就 */}
            <AchievementSection
                achievements={profile?.achievements || []}
                onUpdate={(achievements) => handleProfileUpdate({ ...profile, achievements })}
            />
        </motion.div>
    );
};

export default Profile; 