import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

const SkillsSection = ({ skills, interests, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const [editedSkills, setEditedSkills] = useState(skills);
    const [editedInterests, setEditedInterests] = useState(interests);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim() && !editedSkills.includes(newSkill.trim())) {
            setEditedSkills([...editedSkills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setEditedSkills(editedSkills.filter(skill => skill !== skillToRemove));
    };

    const handleAddInterest = (e) => {
        e.preventDefault();
        if (newInterest.trim() && !editedInterests.includes(newInterest.trim())) {
            setEditedInterests([...editedInterests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interestToRemove) => {
        setEditedInterests(editedInterests.filter(interest => interest !== interestToRemove));
    };

    const handleSave = () => {
        onUpdate({
            skills: editedSkills,
            interests: editedInterests
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedSkills(skills);
        setEditedInterests(interests);
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">技能与兴趣</h3>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {isEditing ? '取消' : '编辑'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 技能部分 */}
                <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">技能</h4>
                    {isEditing ? (
                        <div className="space-y-3">
                            <form onSubmit={handleAddSkill} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="添加新技能"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    <FaPlus />
                                </button>
                            </form>
                            <div className="flex flex-wrap gap-2">
                                {editedSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* 兴趣部分 */}
                <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">兴趣</h4>
                    {isEditing ? (
                        <div className="space-y-3">
                            <form onSubmit={handleAddInterest} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    placeholder="添加新兴趣"
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                >
                                    <FaPlus />
                                </button>
                            </form>
                            <div className="flex flex-wrap gap-2">
                                {editedInterests.map((interest, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                    >
                                        {interest}
                                        <button
                                            onClick={() => handleRemoveInterest(interest)}
                                            className="ml-2 text-green-600 hover:text-green-800"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                    >
                        保存
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillsSection; 